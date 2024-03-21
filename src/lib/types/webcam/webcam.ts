export interface ParticipantProps {
    name: string;
    rtcPeer?: any;
    video?: React.RefObject<HTMLVideoElement>;
    ws?: WebSocket | null;
    messageType?:string;
}