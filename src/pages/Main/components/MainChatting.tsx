import * as React from "react";
import styled from 'styled-components';

const MainChatting = () => {
    return (
        <S.MainChattingLayout>
            <S.MainChattingContainer/>
        </S.MainChattingLayout>
    );
};

const S = {
    MainChattingLayout: styled.div`
        background-color: purple;
        color: #fff;
        height: 75%;
        width : 100%;
    `,
    MainChattingContainer: styled.div`
        background-color: white;
        color: #fff;
        width: 90%;
        height: 90%;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `,
};

export default MainChatting;