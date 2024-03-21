import * as kurentoUtils from 'kurento-utils';
import { ParticipantProps } from '../../lib/types/webcam/webcam';

export default class Participant {
    name: string;
    rtcPeer: any;
    video: React.RefObject<HTMLVideoElement>;
    ws: WebSocket | null;
    roomState?:string;
    sendMessage: (message: any) => void;

    constructor(props: ParticipantProps, sendMessage: (message: any) => void) {
        this.name = props.name;
        this.rtcPeer = null;
        this.video = props.video;
        this.ws = props.ws;
        this.sendMessage = sendMessage;
        this.onIceCandidate = this.onIceCandidate.bind(this);

        this.createRtcPeer = this.createRtcPeer.bind(this);
        this.offerToReceiveVideo = this.offerToReceiveVideo.bind(this);
    }

    createRtcPeer(options: any) {
        this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error: any) => {
            if (error) {
                return console.error(error);
            }
            this.rtcPeer.generateOffer(this.offerToReceiveVideo.bind(this));
        });
    }

    offerToReceiveVideo = (error: any, offerSdp: any) => {
        if (error) return console.error('sdp offer error');
        console.log('Invoking SDP offer callback function');
        const msg = {
            id: 'receiveVideoFrom',
            sender: this.name,
            sdpOffer: offerSdp,
        };
        this.sendMessage(msg);
    }

    onIceCandidate(candidate: any, wp: any) {
        console.log('Local candidate' + JSON.stringify(candidate));
        const message = {
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