import * as React from "react";
import styled from 'styled-components';

const MainCamList = () => {
    return (
        <S.MainCamLayout>
            <S.MainCamListLayout>
                {[...Array(10)].map((_, index) => (
                    <S.Item key={index}>
                        {index + 1}
                        <S.Emoji />
                    </S.Item>
                ))}
            </S.MainCamListLayout>
        </S.MainCamLayout>
    );
};

const S = {
    MainCamLayout: styled.div`
        background-color: blue;
        color: #fff;
        height: 100%;
        width: 75%;
    `,
    MainCamListLayout: styled.div`
        background-color: orange;
        color: #fff;
        width: 95%;
        height: 100%;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: flex-start;
        overflow-y: auto;
    `,
    Item: styled.div`
        background-color: black;
        color: #fff;
        width: 45%;
        height: 40%;
        margin: 2%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    Emoji: styled.div`
        background-color: green;
        width: 50px;
        height: 50px;
        position: absolute;
        bottom: 0;
        right: 0;
    `,
};

export default MainCamList;