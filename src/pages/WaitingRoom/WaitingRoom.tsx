import * as React from "react";
import { useState } from "react";
import styled from 'styled-components';
import RightLayout from "./components/RightLayout";
import logo from '../../assets/logo.png'
import btnImg1 from '../../assets/btnImg1.png'
import btnImg2 from '../../assets/btnImg2.png'
import Modal from "./components/Modal";
import enterRoom from '../../assets/enterRoom.png'
import { ModalContent } from "./components/ModalContent";

const WaitingRoom = () => {
    const [inputValue, setInputValue] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);



    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };

    return (
        <>
            <S.Container>
                <S.ContainerHeader>
                    <img src={logo} alt="My Image" style={{ height:'auto', marginLeft:'7px'}}/>
                </S.ContainerHeader>

                <S.ContainerWaitingRoomLayout>
                    {/* 왼쪽 레이아웃 */}
                    <S.ContainerWaitingRoomLayoutLeft>
                        <S.WaitingRoomContainerTitle>
                            <S.WaitingRoomContainerTitleContainer>
                                <h1>재미있게, 재치있게,</h1>
                                <span style={{ display: 'flex', alignItems: 'center', paddingBottom: '8px', width: '90%', height: 'auto', overflow: 'hidden', flexWrap: 'wrap' }}>
                                    <div style={{ color:'#419D78', fontWeight:'bolder'}}>Cam</div>
                                    <div style={{ color:'#FFE66D', fontWeight:'bolder'}}>Is</div>
                                    <div style={{ color:'#FF6B6B', fontWeight:'bolder'}}>Trick</div>
                                </span>
                                <p style={{color:'grey'}}>이모지를 사용해서 활발하게 소통해봐요.<br/>저희가 도와드릴게요!</p>
                            </S.WaitingRoomContainerTitleContainer>
                        </S.WaitingRoomContainerTitle>
                        <S.WaitingRoomContainerInput>
                            <S.WaitingRoomCreateInput placeholder='Create Nickname' className="custom-input" value={inputValue} onChange={handleInputChange}  maxLength="16npm"/>
                        </S.WaitingRoomContainerInput>
                        <S.WaitingRoomContainerButtonContainer>
                            <div style={{display : 'flex', width : '100%', height: '100%', justifyContent:'space-between'}}>
                                <button style={{display: 'flex', alignItems:'center', justifyContent:'space-evenly', background: 'white', width: '48%', height:'100%',borderRadius: '5px', border: 'none', boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.5)', fontSize:'17px', color:'grey'}}>
                                    <p>방 생성</p>
                                    <img src={btnImg1} alt="My Image" style={{width:'25%', height:'70%'}}/>
                                </button>
                                <button onClick={openModal} style={{display: 'flex', alignItems:'center', justifyContent:'space-evenly', background: 'white', width: '48%', height:'100%', borderRadius: '5px', border: 'none', boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.5)', fontSize:'17px', color:'grey'}}>
                                    <p>방 참가</p>
                                    <img src={btnImg2} alt="My Image" style={{width:'25%', height:'70%'}}/>
                                </button>
                            </div>
                        </S.WaitingRoomContainerButtonContainer>
                        <S.WaitingRoomContainerAbout>
                            <div style={{display: 'flex', alignItems:'center', justifyContent:'space-between', width:'253px', height : '17px'}}>
                                <div style={{fontSize : '15px', color:'grey'}}>CamIsTrick에 관해 </div>
                                <a href="https://github.com/CamIsTrick" target="_blank" style={{fontSize: '15px', color: '#419D78', fontWeight: 'bold', textDecoration: 'none'}}>자세히 알아보세요!</a>
                            </div>
                        </S.WaitingRoomContainerAbout> 
                    </S.ContainerWaitingRoomLayoutLeft>
                    {/* 오른쪽 레이아웃 */}
                    <S.ContainerWaitingRoomLayoutRight>
                        <RightLayout inputValue={inputValue}/>
                    </S.ContainerWaitingRoomLayoutRight>
                </S.ContainerWaitingRoomLayout>
                {/* 모달 */}
                <Modal isOpen={modalIsOpen} onClose={closeModal}>
                    <ModalContent/>
                </Modal>

            </S.Container>
        </>
    );
};

const S = {
    Container : styled.div`
        // background : red;
        height: 100vh;
    `,
    ContainerHeader : styled.div`
        // background : red;
        height: 70px;
        width : 100%;
        display : flex;
        align-items:center;
        

        img {
            width:200px;
            height:'auto'
            marginLeft:'7px';
        }

        @media (max-width: 480px) {
            position : relative;
            top:3%;
            img {
                width: 130px;
            }
          }
    `,
    ContainerWaitingRoomLayout : styled.div`
        position : relative;
        // background : red;
        height: 70%;
        width : 70%;
        top : 45%;
        left : 50%;
        transform : translate(-50%, -50%);
        display : flex;

        @media (max-width: 480px) {
            width: 95%;
            height: 90%;
            font-size: 1rem;
            display:block;
          }
    `,
    ContainerWaitingRoomLayoutLeft : styled.div`
        // background : blue;
        height: 100%;
        width : 50%;

        @media (max-width: 480px) {
            width: 100%;
            height: 40%;
            font-size: 1rem;
          }
    `,
    WaitingRoomContainerTitle : styled.div`
        // background : green;
        width : 100%;
        margin-top : 40px;

        @media (max-width: 480px) {
            positon: absolute;
            font-size: 1rem;
            display:block;
          }
    `,
    WaitingRoomContainerTitleContainer : styled.div`
        // background: yellow;

        span {
            font-size:70px;
        }

        @media (max-width: 480px) {
            font-size:0.8rem;
            text-align: center;

            span {
                font-size: 3rem;
                justify-content: center;
                padding-left:10px;
            }
          }
    `,
    WaitingRoomContainerInput : styled.div`
        // background : red;
        margin-top : 30px;
        height: 10%;
        width : 65%;

        @media (max-width: 480px) {
            padding-left:65px;
          }
    `,
    WaitingRoomCreateInput: styled.input`
        height: 100%;
        width : 100%;
        border: none;
        border-bottom: 2px solid #d3d3d3;
        outline: none;
        font-size: 20px;
        color: grey;

        &::placeholder {
            color: #d3d3d3;
        }
    `,
    WaitingRoomContainerButtonContainer : styled.div`
        // background : red;
        height: 10%;
        width : 65%;
        margin-top : 20px;

        @media (max-width: 480px) {
            font-size: 1rem;
            display:block;
            padding-left:65px;
          }
    `,
    WaitingRoomContainerAbout : styled.div`
        // background : red;
        align-items: center;
        margin-top : 20px;

        @media (max-width: 480px) {
            // background-color:red;
            position: absolute;
            bottom: 1.5vh;
            left: 50%;
            transform: translateX(-50%);
          }
    `,
    ContainerWaitingRoomLayoutRight : styled.div`
        // background : brown;
        height: 100%;
        width : 50%;
        display : flex;

        @media (max-width: 480px) {
            width: 100%;
            height:40%;
            font-size: 1rem;
            display:block;
          }
    `,
};

export default WaitingRoom;
