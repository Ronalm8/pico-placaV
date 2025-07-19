import React, { useState, useEffect } from 'react';

const TimeInfo = ({ currentRestriction }) => {
    const [timeInfo, setTimeInfo] = useState({ 
        elapsedTime: '',
        remainingTime: '',
        isActive: false 
    });

    useEffect(() => {
        const calculateTimes = () => {
            if (!currentRestriction?.schedules) return;

            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            for (const schedule of currentRestriction.schedules) {
                const [startHour, startMinute] = schedule.start.split(':').map(Number);
                const [endHour, endMinute] = schedule.end.split(':').map(Number);
                
                const startTimeInMinutes = startHour * 60 + startMinute;
                const endTimeInMinutes = endHour * 60 + endMinute;

                if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
                    const elapsedMinutes = currentTimeInMinutes - startTimeInMinutes;
                    const remainingMinutes = endTimeInMinutes - currentTimeInMinutes;

                    setTimeInfo({
                        elapsedTime: `${Math.floor(elapsedMinutes / 60)}h ${elapsedMinutes % 60}m`,
                        remainingTime: `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m`,
                        isActive: true
                    });
                    return;
                }
            }

            setTimeInfo({
                elapsedTime: '',
                remainingTime: '',
                isActive: false
            });
        };

        const timer = setInterval(calculateTimes, 60000);
        calculateTimes();

        return () => clearInterval(timer);
    }, [currentRestriction]);

    if (!timeInfo.isActive) return null;

    return (
        <div className="time-info">
            <div className="time-elapsed">
                <span>Tiempo transcurrido:</span>
                <strong>{timeInfo.elapsedTime}</strong>
            </div>
            <div className="time-remaining">
                <span>Tiempo restante:</span>
                <strong>{timeInfo.remainingTime}</strong>
            </div>
        </div>
    );
};

export default TimeInfo;