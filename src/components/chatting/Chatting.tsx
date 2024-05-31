import * as React from "react";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Participant from "src/lib/types/Participant";

interface Message {
  id: number;
  text: string;
  sender: string;
  senderName: string; // 메시지 보낸 사람의 이름 추가
}

interface ChatProps {
  participant: Participant; // Participant 객체를 props로 받음
}

const Chatting: React.FC<ChatProps> = ({ participant }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://focusing.site/signal");
    ws.current.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "" && ws.current) {
      const message: Message = {
        id: Date.now(),
        text: input,
        sender: participant.sessionId, // Participant 객체의 sessionId 사용
        senderName: participant.name, // Participant 객체의 name 사용
      };
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  return (
    <S.ChatContainer>
      <S.MessageList>
        {messages.map((msg) => (
          <S.MessageItem
            key={msg.id}
            isOwnMessage={msg.sender === participant.sessionId}
          >
            {msg.senderName}: {msg.text}
          </S.MessageItem>
        ))}
      </S.MessageList>
      <S.InputContainer>
        <S.Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        />
        <S.SendButton onClick={sendMessage} disabled={input.trim() === ""}>
          보내기
        </S.SendButton>
      </S.InputContainer>
    </S.ChatContainer>
  );
};

const S = {
  ChatContainer: styled.div`
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 95%;
    width: 90%;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
  `,
  MessageList: styled.div`
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
  `,
  MessageItem: styled.div<{ isOwnMessage: boolean }>`
    background-color: ${(props) =>
      props.isOwnMessage ? "#69a085" : "#e0e0e0"};
    color: ${(props) => (props.isOwnMessage ? "white" : "black")};
    padding: 8px 12px;
    border-radius: 15px;
    margin-bottom: 5px;
    align-self: ${(props) => (props.isOwnMessage ? "flex-end" : "flex-start")};
  `,
  InputContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  Input: styled.input`
    max-width: 300px;
    flex: 1;
    padding: 12px;
    border: 3px solid #ccc;
    border-radius: 13px;
    margin-right: 10px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
  `,
  SendButton: styled.button<{ disabled: boolean }>`
    padding: 13px 20px;
    background-color: ${(props) => (props.disabled ? "#ccc" : "#69a085")};
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    font-size: 16px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;

    &:hover {
      background-color: ${(props) => (props.disabled ? "#ccc" : "#507C67")};
    }
  `,
};

export default Chatting;
