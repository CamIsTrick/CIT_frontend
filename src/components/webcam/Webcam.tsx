//파일 나누기
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import * as kurentoUtils from 'kurento-utils';
import Participant from '../../lib/types/Participant';
import VideoElement from "./VideoElement";

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

interface ParticipantListProps {
    participants: { [name: string]: Participant };
    isMainParticipant: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = React.memo(({ participants, isMainParticipant }) => {

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
    

    return (
        <>
            {Object.entries(participants).map(([name, participant]) => (
                <div key={name} id={name} className={isMainParticipant ? PARTICIPANT_MAIN_CLASS : PARTICIPANT_CLASS} onClick={() => switchContainerClass(name)}>
                    <VideoElement name={name} ws={participant.ws} video={participant.video} sessionId={participant.sessionId}/>
                    <span>{name}</span>
                </div>
            ))}
        </>
    );
});

const Webcam: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);
    const leaveBtnRef = useRef<HTMLButtonElement>(null); // Leave 버튼에 대한 ref 추가
    const ws = useRef<WebSocket | null>(null); 
    const [participants, setParticipants] = useState<{ [name: string]: Participant }>({});
    const [userName, setUserName] = useState<string>("");
    const [isMainParticipant, setIsMainParticipant] = useState(false);

    // participants와 isMainParticipant를 useMemo로 메모이제이션
    const memoizedParticipants = React.useMemo(() => participants, [participants]);
    const memoizedIsMainParticipant = React.useMemo(() => isMainParticipant, [isMainParticipant]);

    const sendMessage = (message: any) => {
        const jsonMessage = JSON.stringify(message);
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
        const parsedMessage = JSON.parse(message.data);

        console.info('Received message: ' + message.data);

        switch (parsedMessage.id) {
            case 'existingParticipants':
                console.log(2)
                onExistingParticipants(parsedMessage);
                break;
            case 'newParticipantArrived':
                console.log(3)
                onNewParticipant(parsedMessage);
                break;
            case 'receiveVideoAnswer':
                console.log(4)
                receiveVideoResponse(parsedMessage);
                break;
            case 'createRoomResponse': //백엔드에서 보낸 ROOMURL
                console.log(1)
                createRoomResponse(parsedMessage);
                break;
            case 'iceCandidate':
                console.log(0)
                
        //         participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error: any) {
        //             if (error) {
        //                 console.error("Error adding candidate: " + error);
        //                 return;
        //             }
        //         });
        //         break;
        //     case 'participantExit':
        //         onParticipantLeft(parsedMessage);
        //         break;
        //     default:
        //         console.error('Unrecognized message', parsedMessage);
        // }
        // };

                if (!participants[parsedMessage.name] || !participants[parsedMessage.name].rtcPeer) {
                    console.error('Participant or RTC peer not found:', parsedMessage.name);
                    return;
                }
                participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, (error) => {
                    if (error) {
                        console.error('Error adding candidate:', error);
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
        const sessionId : string = localStorage.getItem('sessionId')
        const newParticipants = { ...participants };
        const participant = new Participant({ name: nameRef.current?.value || '', ws: ws.current, sessionId }, sendMessage);
        newParticipants[nameRef.current?.value || ''] = participant;
        setParticipants(newParticipants);
        const video = participant.video;

        const options = {
            localVideo: video,
            mediaConstraints: constraints,
            onicecandidate: participant.onIceCandidate.bind(participant), //수정한 코드
            //onicecandidate: (candidate: any) => participant.onIceCandidate(candidate, participant, sessionId),
        };

        participant.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error: any) => { //participant.createRtcPeer!(options) 함수의 코드와 동일
            if (error) {
                return console.error(error);
            }
            participant.rtcPeer.generateOffer(participant.offerToReceiveVideo.bind(participant));
        });
        // participant.createRtcPeer!(options);

        msg.data.forEach(receiveVideo);
    };

    const onNewParticipant = (request: any) => {
        console.log("onNewParticipant", request.name)
        receiveVideo(request.name);
    };

    const receiveVideoResponse = (result: any) => {
        const newParticipants = { ...participants };
        console.log(newParticipants, "receiveVideoResponse")
        console.log("최종 테스트", newParticipants[result.name].rtcPeer)
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

    const createRoomResponse = (response: any) => { //백엔드에서 응답받은 createroom 메시지
        const {roomId,entryCode,roomURL,sessionId} = response;
        console.log('Received createRoomResponse:', response);
        localStorage.setItem('sessionId', sessionId)
        /*const message = {
            id: 'createRoomResponse',
            roomId: roomId,
            entryCode: entryCode,
            roomURL: roomURL,
            sessionId:sessionId,
        };
        sendMessage(message);*/
    }

    const joinRoom = () => {
        if(!nameRef.current?.value) return;

        if (!nameRef.current?.value || !roomIdRef.current?.value) return;
        setUserName(nameRef.current.value);
        const sessionId : string = localStorage.getItem('sessionId')

        const newParticipant = new Participant({ name: nameRef.current.value, ws: ws.current, sessionId }, sendMessage);

        // 기존 참가자 목록 복사 후 새로운 참가자 추가
        const updatedParticipants = { ...participants };
        updatedParticipants[nameRef.current.value] = newParticipant;
    
        // 상태 업데이트
        setParticipants(updatedParticipants);
        
        const message = {
            id: 'joinRoom',
            name: nameRef.current.value,
            roomId: roomIdRef.current.value,
        };
        sendMessage(message);
        setIsMainParticipant(false);

        document.getElementById('container')?.style.setProperty('visibility', 'hidden');
        leaveBtnRef.current?.style.setProperty('visibility', 'visible'); // Leave 버튼에 대한 스타일 조작
    };

    const createRoom = () => {
        if (!nameRef.current?.value) return;
        setUserName(nameRef.current.value);
        const sessionId : string = localStorage.getItem('sessionId')
        const newParticipant = new Participant({ name: nameRef.current.value, ws: ws.current,sessionId }, sendMessage);

        // 기존 참가자 목록 복사 후 새로운 참가자 추가
        const updatedParticipants = { ...participants };
        updatedParticipants[nameRef.current.value] = newParticipant;
    
        // 상태 업데이트
        setParticipants(updatedParticipants);
        setIsMainParticipant(true);

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
        const sessionId : string = localStorage.getItem('sessionId')
        console.log("session id 입니다.",sessionId)
        const participant = new Participant({ name: sender, ws: ws.current,sessionId }, sendMessage);
        
        console.log("participant 입니다.",participant)
        const options = {
            remoteVideo: participant.video,
            onicecandidate:participant.onIceCandidate.bind(participant), //수정한 코드
            //onicecandidate: (candidate: any) => participant.onIceCandidate(candidate, participant, sessionId),
        };

        participant.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error: any) => { //participant.createRtcPeer 함수의 코드와 동일
            if (error) {
                return console.error(error);
            }
            console.log("receiveVideo participan:",participant);
            participant.rtcPeer.generateOffer(participant.offerToReceiveVideo.bind(participant));
        });
        
        // participant.createRtcPeer!(options);
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
                {userName !== '' && <ParticipantList participants={memoizedParticipants} isMainParticipant={memoizedIsMainParticipant}/>}
            </div>
        </>
    );
};

export default Webcam;