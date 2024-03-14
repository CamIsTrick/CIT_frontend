import * as React from "react";
import { useState, useRef, useEffect } from "react";
import * as kurentoUtils from 'kurento-utils';

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

interface ParticipantProps {
    name: string;
    rtcPeer?: any;
    video?: HTMLVideoElement;
    ws: WebSocket | null;
}

class Participant {
    name: string;
    rtcPeer: any;
    video: HTMLVideoElement;
    ws: WebSocket | null;
    sendMessage: (message: any) => void;

    constructor(props: ParticipantProps, sendMessage: (message: any) => void) {
        this.name = props.name;
        this.rtcPeer = null;
        this.video = props.video!;
        this.ws = props.ws;
        this.sendMessage = sendMessage;
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.video.autoplay = true;
        this.video.controls = false;
    }

    createRtcPeer(options: any) {
        kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error: any) => {
            if (error) {
                return console.error(error);
            }
            this.rtcPeer = kurentoUtils.WebRtcPeer;
            this.rtcPeer.generateOffer(this.offerToReceiveVideo.bind(this));
        });
    }

    offerToReceiveVideo = (error: any, offerSdp: any) => {
        if (error) return console.error('sdp offer error');
        console.log('Invoking SDP offer callback function');
        var msg = {
            id: 'receiveVideoFrom',
            sender: this.name,
            sdpOffer: offerSdp,
        };
        this.sendMessage(msg);
    }

    onIceCandidate(candidate: any, wp: any) {
        console.log('Local candidate' + JSON.stringify(candidate));
        var message = {
        id: 'onIceCandidate',
        candidate: candidate,
        name: this.name,
        };

        this.sendMessage(message);
    }

    dispose() {
        console.log('Disposing participant ' + this.name);
        if (this.rtcPeer) {
        this.rtcPeer.dispose(); 
        }
        const container = document.getElementById(this.name);
        if(container){
            container.parentNode?.removeChild(container);
        }
    }
}

const VideoElement: React.FC<ParticipantProps> = ({ name }) => {
    return (
        <video id={`video-${name}`} autoPlay controls></video>
    );
}

interface ParticipantListProps {
    participants: { [name: string]: Participant };
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
    const [isMainParticipant, setIsMainParticipant] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);

    const switchContainerClass = (name: string) => {
        const container = document.getElementById(name);
        if (container && container.className === PARTICIPANT_CLASS) {
        const elements = Array.prototype.slice.call(document.getElementsByClassName(PARTICIPANT_MAIN_CLASS));
        elements.forEach(function (item) {
            item.className = PARTICIPANT_CLASS;
        });
        container.className = PARTICIPANT_MAIN_CLASS;
        } else if (container) {
        container.className = PARTICIPANT_CLASS;
        }
    };

    if (isRemoved) {
        return null; 
    }

    return (
        <>
            {Object.entries(participants).map(([name, participant]) => (
                <div key={name} id={name} className={isMainParticipant ? PARTICIPANT_MAIN_CLASS : PARTICIPANT_CLASS} onClick={() => switchContainerClass(name)}>
                    <VideoElement name={name} ws={participant.ws} />
                    <span>{name}</span>
                </div>
            ))}
        </>
    );
};

const Webcam: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);
    const leaveBtnRef = useRef<HTMLButtonElement>(null); // Leave 버튼에 대한 ref 추가
    const ws = useRef<WebSocket | null>(null);
    const rtcPeerRef = useRef<any>(null); 
    const [participants, setParticipants] = useState<{ [name: string]: Participant }>({});
    const [userName, setUserName] = useState<string>("");
    const [showJoinRoomInput,setShowJoinRoomInput] = useState(false);

    const sendMessage = (message: any) => {
        var jsonMessage = JSON.stringify(message);
        console.log('Sending message: ' + jsonMessage);
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(jsonMessage);
        }
    }

    useEffect(() => {
        ws.current = new WebSocket('wss://focusing.site/signal');
        ws.current.onopen = function () {
        console.log('WebSocket connection opened.');
        }
        ws.current.onmessage = function (message: any) {
        var parsedMessage = JSON.parse(message.data);

        console.info('Received message: ' + message.data);

        switch (parsedMessage.id) {
            case 'existingParticipants':
                onExistingParticipants(parsedMessage);
                break;
            case 'newParticipantArrived':
                onNewParticipant(parsedMessage);
                break;
            case 'receiveVideoAnswer':
                receiveVideoResponse(parsedMessage);
                break;
            case 'iceCandidate':
                participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error: any) {
                    if (error) {
                        console.error("Error adding candidate: " + error);
                        return;
                    }
                });
                break;
            case 'participantExit':
                onParticipantLeft(parsedMessage);
                break;
            default:
                console.error('Unrecognized message', parsedMessage);
        }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const onExistingParticipants = (msg: any) => {
        const constraints = {
            audio: true,
            video: {
                mandatory: {
                    maxWidth: 320,
                    maxFrameRate: 15,
                    minFrameRate: 15,
                },
            },
        };
        console.log(nameRef.current?.value + ' registered in room ' + roomIdRef.current?.value);
        const newParticipants = { ...participants };
        const participant = new Participant({ name: nameRef.current?.value || '', ws: ws.current }, sendMessage);
        newParticipants[nameRef.current?.value || ''] = participant;
        setParticipants(newParticipants);
        const video = participant.video;

        var options = {
            localVideo: video,
            mediaConstraints: constraints,
            onicecandidate: (candidate: any) => participant.onIceCandidate(candidate, participant),
        };

        participant.createRtcPeer!(options);

        msg.data.forEach(receiveVideo);
    };

    const onNewParticipant = (request: any) => {
        receiveVideo(request.name);
    };

    const receiveVideoResponse = (result: any) => {
        const newParticipants = { ...participants };
        newParticipants[result.name].rtcPeer.processAnswer(result.sdpAnswer, (error: any) => {
            if (error) return console.error(error);
        });
        setParticipants(newParticipants);
    };

    //고유한 키값을 사용
    const onParticipantLeft = (request: any) => {
        console.log('Participant ' + request.name + ' left');
        const newParticipants = { ...participants };
        newParticipants[request.name].dispose();
        delete newParticipants[request.name];
        setParticipants(newParticipants);
    };

    const joinRoom = () => {
        if(!nameRef.current?.value) return;
        
        setShowJoinRoomInput(true);
        if (!nameRef.current?.value || !roomIdRef.current?.value) return;
        const message = {
            id: 'joinRoom',
            name: nameRef.current.value,
            roomId: roomIdRef.current.value,
        };
        sendMessage(message);

        document.getElementById('container')?.style.setProperty('visibility', 'hidden');
        leaveBtnRef.current?.style.setProperty('visibility', 'visible'); // Leave 버튼에 대한 스타일 조작
    };
    const createRoom = () => {
        if (!nameRef.current?.value) return;
        const message = {
            id:'createRoom',
            name: nameRef.current.value,
        };
        sendMessage(message);
        
        document.getElementById('container')?.style.setProperty('visibility', 'hidden');
        leaveBtnRef.current?.style.setProperty('visibility', 'visible'); // Leave 버튼에 대한 스타일 조작
    };

    const leaveRoom = () => {
        sendMessage({id:'exit'});
        document.getElementById('container')?.style.setProperty('visibility', 'hidden');
        leaveBtnRef.current?.style.setProperty('visibility', 'visible'); // Leave 버튼에 대한 스타일 조작

        window.location.reload();
    }

    const receiveVideo = (sender: any) => {
        const newParticipants = { ...participants };
        const participant = new Participant({ name: sender, ws: ws.current }, sendMessage);
        const options = {
            remoteVideo: participant.video,
            onicecandidate: (candidate: any) => participant.onIceCandidate(candidate, participant),
        };

        participant.createRtcPeer!(options);
        newParticipants[sender] = participant;
        setParticipants(newParticipants);
    };

    return (
        <>
            <div id='container'>
                <div className='title'>😁FACE OUT😁</div>
                <input type="text" id="name" ref={nameRef} placeholder="Enter your name" />
                <input type="text" id="roomName" ref={roomIdRef} placeholder="Enter room name" />
                <button id="registerBtn" onClick={createRoom}>🔑방 생성🔑</button>
                <button id="registerBtn" onClick={joinRoom}>방 참가</button>
            </div>
            <button ref={leaveBtnRef} id="leaveBtn" onClick={leaveRoom} style={{ visibility: 'hidden' }}>🙌Leave🙌</button> {/* Leave 버튼에 대한 ref 추가 */}
            
            <div id='participants'>
                {userName && <ParticipantList participants={participants} />}
            </div>
        </>
    );
};

export default Webcam;