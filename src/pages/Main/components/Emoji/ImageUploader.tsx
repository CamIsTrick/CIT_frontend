import * as React from "react";
import { useState, useRef } from "react";
import styled from "styled-components";
import Participant from "src/lib/types/Participant";
import SendOption from "./SendOption";

const ImageUploader = ({ participants }) => {
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const isReadyToSend = Boolean(selectedImage && selectedParticipant);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (typeof result === "string") {
        setPreviewImage(result);
      }
    };
    reader.readAsDataURL(file); // 파일을 데이터 URL로 변환
  };
  const handleSendImage = () => {
    // 선택된 참가자나 이미지가 없으면 함수 종료.
    if (!selectedImage) return;

    // participants 객체가 유효하고 비어 있지 않은지 확인
    if (!participants || Object.keys(participants).length === 0) {
      console.error("참가자가 없습니다.");
      return;
    }

    if (selectedParticipant === "everyone") {
      // "전체" 참가자에게 이미지 전송
      Object.keys(participants).forEach((name) => {
        const participant = participants[name];
        if (participant) {
          participant.selectedImage = selectedImage;
          participant.sendAnonymously = sendAnonymously;
        }
      });
    } else {
      // 특정 참가자에게만 이미지 전송
      const participant = participants[selectedParticipant];
      if (!participant) return;

      participant.selectedImage = selectedImage;
      participant.sendAnonymously = sendAnonymously;
    }
  };

  return (
    <div>
      <S.StyledSelect
        value={selectedParticipant}
        onChange={(e) => setSelectedParticipant(e.target.value)}
      >
        <option value="">누구에게 보낼까요?</option>
        <option value="everyone">전체</option>
        {participants &&
          Object.keys(participants).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
      </S.StyledSelect>
      <S.FileLabel>
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          "+"
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </S.FileLabel>
      <SendOption
        handleSendImage={handleSendImage}
        sendAnonymously={sendAnonymously}
        setSendAnonymously={setSendAnonymously}
        isReadyToSend={isReadyToSend}
      />
    </div>
  );
};
const S = {
  StyledSelect: styled.select`
    padding: 6px 10px;
    border-radius: 10px;
    background-color: #f0f0f0;
    border: 3px solid #ccc;
    font-size: 14px;
    color: #ccc;
    font-weight: 800;
    margin-bottom: 10px;

    &:hover {
      background-color: #e9e9e9;
    }

    &:focus {
      border-color: #0056b3;
      outline: none;
    }
  `,
  FileLabel: styled.label`
    width: 70%;
    height: 100px;
    color: #ccc;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    font-weight: 300;
    border: 4px dashed #ccc;
    border-radius: 15px;
    overflow: hidden;
  `,
  PreviewImage: styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  `,
};
export default ImageUploader;
