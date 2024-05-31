import * as React from "react";
// import Chatting from "src/components/chatting/Chatting";
import Chatting from "../../../components/chatting/Chatting";
import styled from "styled-components";

const MainChatting = () => {
  return (
    <S.MainChattingLayout>
      <S.Chatting />
    </S.MainChattingLayout>
  );
};

const S = {
  MainChattingLayout: styled.div`
    background-color: purple;
    color: #fff;
    height: 75%;
    width: 100%;
  `,
  Chatting: styled(Chatting)``,
};

export default MainChatting;
