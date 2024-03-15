import * as React from "react";
import { useState } from 'react';
import styled from 'styled-components';


const AnonButtonWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
`;

interface SwitchProps {
  isOn: boolean;
}

const Switch = styled.div<SwitchProps>`
  position: relative;
  display: inline-block;
  width: 55px;
  height: 25px;
  background-color: ${({ isOn }) => (isOn ? '#FF6B6B' : '#ccc')};
  border-radius: 15px;
  transition: background-color 0.3s ease;
`;

const SwitchCircle = styled.div<SwitchProps>`
  position: absolute;
  top: 50%;
  transform: ${({ isOn }) => (isOn ? 'translate(calc(100% + 17px), -50%)' : 'translate(2px, -50%)')};
  width: 18px;
  height: 18px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s ease;
`;

const Label = styled.span<SwitchProps>`
  position: absolute;
  top: 50%;
  ${({ isOn }) => (isOn ? 'left: 17px;' : 'right: -7px;')};
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 14px;
`;

const AnonButton: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  return (
    <AnonButtonWrapper onClick={toggleAnonymous}>
      <Switch isOn={isAnonymous}>
        <SwitchCircle isOn={isAnonymous} />
        <Label isOn={isAnonymous}>{isAnonymous ? '익명' : '실명'}</Label>
      </Switch>
    </AnonButtonWrapper>
  );
};

export default AnonButton;