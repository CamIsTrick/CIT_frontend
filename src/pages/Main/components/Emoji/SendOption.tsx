import * as React from "react";
import styled from "styled-components";
import AnonButton from "./AnonButton";

interface SendOptionProps {
  handleSendImage: () => void;
  sendAnonymously: boolean;
  setSendAnonymously: (value: boolean) => void;
  isReadyToSend: boolean;
}

export default function SendOption({
  handleSendImage,
  sendAnonymously,
  setSendAnonymously,
  isReadyToSend,
}: SendOptionProps) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <S.StyledButton onClick={handleSendImage} disabled={!isReadyToSend}>
          전송하기
        </S.StyledButton>
        <AnonButton
          isAnonymous={sendAnonymously}
          toggleAnonymous={() => setSendAnonymously(!sendAnonymously)}
          disabled={!isReadyToSend}
        />
      </div>
    </>
  );
}
const S = {
  StyledButton: styled.button<{ disabled: boolean }>`
    padding: 8px 16px;
    background-color: ${(props) => (props.disabled ? "#ccc" : "#69a085")};
    color: white;
    border: none;
    border-radius: 15px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
      background-color: ${(props) => (props.disabled ? "#ccc" : "#507C67")};
    }
  `,
};
