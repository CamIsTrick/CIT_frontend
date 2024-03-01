import * as React from "react";
import styled from 'styled-components';

const MainSetting = () => {
    return (
        <S.MainSettingLayout>
            <S.MainSettingContainer>
                
            </S.MainSettingContainer>
        </S.MainSettingLayout>
    );
};

const S = {
    MainSettingLayout: styled.div`
        background-color: yellow    ;
        color: #fff;
        height: 25%;
        width : 100%;
    `,
    MainSettingContainer: styled.div`
        background-color: white;
        color: #fff;
        width: 90%;
        height: 80%;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `,
};

export default MainSetting;