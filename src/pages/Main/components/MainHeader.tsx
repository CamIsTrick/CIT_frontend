import React, { useState } from 'react';
import styled from 'styled-components';

const MainHeader = () => {

    return (
        <S.MainHeader>
            <S.MainHeaderLogo src="주소" alt="로고" />
        </S.MainHeader>
    );
};

const S = {
    MainHeader: styled.header`
        background-color: green;
        color: #fff;
        height : 45px;
        display: flex; 
        justify-content: space-between;
        align-items: center; 
    `,

    MainHeaderLogo: styled.img`
        background-color: red;
        height: 100%; 
        width : 150px;
    `,
};

export default MainHeader;