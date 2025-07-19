import React from 'react';
import { useTime } from '../hooks/useTime';
import clockIcon from '../assets/Caracol_Televisión_logo.svg.png';

function Clock() {
    const { formatTime } = useTime();

    return (
        <>
            <div className="logo-container">
                <img src={clockIcon} alt="logo" className="clock-icon" />
            </div>
            
            <div className="clock-container">
                <div className="clock">
                    <span className="time">{formatTime()}</span>
                </div>
            </div>
        </>
    );
}

export default Clock;