import { ParticipantProps } from '../../lib/types/webcam/webcam';

export default class Participant {
    sessionId: string;
    name: string;
    rtcPeer: any;
    video: React.RefObject<HTMLVideoElement>;
    ws: WebSocket | null;
    roomState?:string;
    sendMessage: (message: any) => void;

    constructor(props: ParticipantProps, sendMessage: (message: any) => void) {
        this.name = props.name;
        this.sessionId = props.sessionId;
        this.rtcPeer = null;
        this.video = props.video;
        this.ws = props.ws;
        this.sendMessage = sendMessage;
        this.onIceCandidate = this.onIceCandidate.bind(this);

       // this.createRtcPeer = this.createRtcPeer.bind(this);
        this.offerToReceiveVideo = this.offerToReceiveVideo.bind(this);
    }

    // createRtcPeer(options: any) {
    //     this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error: any) => {
    //         if (error) {
    //             return console.error(error);
    //         }
    //         // Offer 생성 코드를 이 위치에 넣어주어야 함
    //         this.rtcPeer.generateOffer((error: any, offerSdp: any) => {
    //             if (error) return console.error('sdp offer error');
    //             console.log('Invoking SDP offer callback function');
    //             var msg = {
    //                 id: 'receiveVideoFrom',
    //                 sender: this.name,
    //                 sdpOffer: offerSdp,
    //             };
    //             this.sendMessage(msg);
    //         });
    //     });
    // }
    
    // createRtcPeer(options: any) {
    //     this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error: any) => {
    //         if (error) {
    //             return console.error(error);
    //         }
    //         this.rtcPeer.generateOffer(this.offerToReceiveVideo.bind(this));
    //     });
    // }

    offerToReceiveVideo = (error: any, offerSdp: any, sessionId:string) => {
        if (error) return console.error('sdp offer error');
        console.log('Invoking SDP offer callback function');
        const msg = {
            id: 'receiveVideoFrom',
            sender: this.name,
            sdpOffer: offerSdp,
            sessionId: this.sessionId,
        };
        this.sendMessage(msg);
    }

    onIceCandidate(candidate: any, wp: any, sessionId:string) {
        console.log('Local candidate' + JSON.stringify(candidate));
        const message = {
            id: 'onIceCandidate',
            candidate: candidate,
            name: this.name,
            sessionId:this.sessionId,
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