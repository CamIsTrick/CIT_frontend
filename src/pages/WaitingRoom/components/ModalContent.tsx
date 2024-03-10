import * as React from "react";
import { useState } from "react";

import axios from 'axios'; 
import enterRoom from '../../../assets/enterRoom.png';

export const ModalContent = () => {
    const [inputValue, setInputValue] = useState(''); 

    const handleClick = () => {
        axios.get('http://focusing.site:8081/rooms', {
            params: {
                roomId: inputValue
            }
        }).then(response => {
            console.log(response.data);

        }).catch(error => {
            console.error(error);
        });
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height:'100%'}}>
            <div style={{width: '100%', height: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={enterRoom} alt="My Image" style={{ width: '70%', height: '100%' }} />
            </div>
            <div style={{width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input 
                    value={inputValue} 
                    onChange={handleChange} 
                    style={{ width: '70%', height: '100%', border: 'none', borderBottom: '2px solid #d3d3d3', outline: 'none', textAlign:'center'}} 
                />
            </div>
            <div style={{width: '100%', height: '20%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <button onClick={handleClick} style={{background: '#419D78', height:'100%', width:'70%', border : 'none', color:'white'}}>참가</button>
            </div>
        </div>
    );
};
