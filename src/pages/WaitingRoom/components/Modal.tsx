import * as React from "react";
import { useState } from "react";
import styled from 'styled-components';
import enterRoom from '../../../assets/enterRoom.png'

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (

    <S.ModalContainer>
        <S.ModalContainerLayout>
            <div onClick={onClose} style={{display:'flex', justifyContent:'center', alignItems:'center', fontSize: '15px', fontWeight:'bold', position: 'absolute',width:'10%', height:'15%', color:'grey',top : 0, right:0}}>
                X
            </div>
            {children}
        </S.ModalContainerLayout>
    </S.ModalContainer>
  );
};

const S = {
    ModalContainer : styled.div`
        position : absolute;
        top : 50%;
        left : 50%;
        transform : translate(-50%, -50%);
        width : 100%;
        height : 100vh;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(3px);
    `,
    ModalContainerLayout : styled.div`
        position : absolute;
        top : 50%;
        left : 50%;
        transform : translate(-50%, -50%);
        width : 27%;
        height : 30%;
        background : white;
    `,
};

export default Modal;