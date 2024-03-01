import * as React from "react";
import styled from 'styled-components';
import MainHeader from './components/MainHeader';
import MainCamList from './components/MainCamList';
import MainChatting from './components/MainChatting';
import MainSetting from './components/MainSetting';

const Main = () => {

    return (
        <S.Container>
            <MainHeader/>
            <S.ComponentLayout>
                <MainCamList/>
                <S.ChattingAndSettingLayout>
                    <MainChatting/>
                    <MainSetting/>
                </S.ChattingAndSettingLayout>
            </S.ComponentLayout>
        </S.Container>
    );
};

const S = {
    Container : styled.div`
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow : hidden; 
    `,
    ComponentLayout : styled.div`
        background-color: blue;
        color: #fff;
        height: 100%;
        width : 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    ChattingAndSettingLayout : styled.div`
        background-color: brown;
        color: #fff;
        height: 100%;
        width : 25%;
    `,
};

export default Main;