import { useState, useEffect } from 'react';

export const useTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const meridiem = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formatNumber = (num) => num.toString().padStart(2, '0');

        return `${formatNumber(formattedHours)}:${formatNumber(minutes)}:${formatNumber(seconds)} ${meridiem}`;
    };

    return { time, formatTime };
};