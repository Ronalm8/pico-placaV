import { useState, useCallback, useRef } from 'react';

export const useStatusMessage = () => {
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const scrollPositionRef = useRef(0);

    const showMessage = useCallback((text, isError = false) => {
       
        scrollPositionRef.current = window.scrollY;
        
        setMessage(text);
        setType(isError ? 'error' : 'success');
        setIsVisible(true);

        
        window.scrollTo(0, scrollPositionRef.current);

        setTimeout(() => {
            setIsVisible(false);
            window.scrollTo(0, scrollPositionRef.current);
            
            setTimeout(() => {
                setMessage(null);
                setType('');
            }, 300);
        }, 3000);
    }, []);

    return {
        message,
        type,
        isVisible,
        showMessage
    };
};