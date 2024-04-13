// VideoElement.tsx
import * as React from "react";
import { useEffect } from "react";
import { ParticipantProps } from '../../lib/types/webcam/webcam';

const VideoElement: React.FC<ParticipantProps> = ({ name, video, sessionId }) => {
    useEffect(() => {
        if (video && video.current) {
            video.current.autoplay = true;
            video.current.controls = false;
        }
    }, [video]);

    return (
        <video id={`video-${name}`} ref={video} autoPlay controls></video>
    );
}

export default VideoElement;
