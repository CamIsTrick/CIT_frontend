import { useState } from 'react';
import * as React from "react";

const PickerBox = ({ participants, onSelect }) => {
    const [selectedParticipant, setSelectedParticipant] = useState('');

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedParticipant(selectedValue);
        onSelect(selectedValue); // 선택된 참가자를 상위 컴포넌트로 전달
    };

    return (
        <select value={selectedParticipant} onChange={handleSelectChange}>
            <option value="">Select participant</option>
            {Object.keys(participants).map((name, index) => (
                <option key={index} value={name}>{name}</option>
            ))}
        </select>
    );
};

export default PickerBox;