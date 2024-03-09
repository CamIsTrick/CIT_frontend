import * as React from "react";
import { useEffect, useRef } from "react";
import styled from 'styled-components';

const RightLayout = ({ inputValue }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error('Error accessing webcam:', error);
            });
    }, []);

    return (
        <>
            <S.WaitingRoomContainer>
                <S.WaitingRoomLayout>
                    <S.WaitingRoomContainerLocalCam>
                        <div style={{ position : 'relative', width: 'fit-content', height: 'fit-content'}}>
                            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: 'auto' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width:'fit-content', height:'30px', display:'flex', alignItems:'center', paddingLeft:'6px', paddingRight:'6px', marginBottom:'4px' ,background: 'rgba(0, 0, 0, 0.7)', color:'white' }}>{inputValue}</div>
                        </div>
                    </S.WaitingRoomContainerLocalCam>
                    <S.WaitingRoomContainerText>
                        잠깐🙌 입장 전, 한 번만 더 확인해봐요!
                    </S.WaitingRoomContainerText>
                </S.WaitingRoomLayout>
            </S.WaitingRoomContainer>
        </>
    );
};

const S = {
    WaitingRoomContainer : styled.div`
        // background : aqua;
        // height: 100vh;
        width : 100%;
        display : flex;
        justify-content : center;
        align-items: center;
    `,
    WaitingRoomLayout : styled.div`
        // background : yellow;
        width : 100%;
    `,
    WaitingRoomContainerLocalCam : styled.div`
        // position : relative;
        // background : blue;
        display : flex;
        // justify-content : center;
        width : 100%;
        // height : 50%;
    `,
    WaitingRoomContainerText : styled.div`
        // background : green;
        display : flex;
        align-items: center;
        justify-content : center;
        color : grey;
    `
};

export default RightLayout;