import * as React from "react";
import { useState } from "react";
import styled from "styled-components";

interface AnonButtonProps {
  isAnonymous: boolean;
  toggleAnonymous: () => void;
  disabled: boolean;
}

const AnonButton: React.FC<AnonButtonProps> = ({
  isAnonymous,
  toggleAnonymous,
}) => {
  return (
    <S.AnonButtonWrapper onClick={toggleAnonymous}>
      <S.Switch $ison={isAnonymous}>
        <S.SwitchCircle $ison={isAnonymous} />
        <S.Label $ison={isAnonymous}>{isAnonymous ? "익명" : "실명"}</S.Label>
      </S.Switch>
    </S.AnonButtonWrapper>
  );
};

const S = {
  AnonButtonWrapper: styled.div`
    display: inline-block;
    cursor: pointer;
  `,
  Switch: styled.div<{ $ison: boolean }>`
    position: relative;
    display: inline-block;
    width: 55px;
    height: 25px;
    background-color: ${({ $ison }) => ($ison ? "#FF6B6B" : "#ccc")};
    border-radius: 15px;
    transition: background-color 0.3s ease;
  `,
  SwitchCircle: styled.div<{ $ison: boolean }>`
    position: absolute;
    top: 50%;
    transform: ${({ $ison }) =>
      $ison ? "translate(calc(100% + 17px), -50%)" : "translate(2px, -50%)"};
    width: 18px;
    height: 18px;
    background-color: #fff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  `,
  Label: styled.span<{ $ison: boolean }>`
    position: absolute;
    top: 50%;
    ${({ $ison }) => ($ison ? "left: 17px;" : "right: -7px;")};
    transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: 14px;
  `,
};
export default AnonButton;
