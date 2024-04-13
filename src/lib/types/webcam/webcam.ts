export interface ParticipantProps {
    sessionId: string;
    name: string;
    rtcPeer?: any;
    video?: React.RefObject<HTMLVideoElement>;
    ws?: WebSocket | null;
    messageType?:string;
}