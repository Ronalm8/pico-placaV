import React from 'react';

const StatusMessages = ({ apiError, message, type, isVisible }) => {
  return (
    <>
      {apiError && <div className="status-message error">{apiError}</div>}
      {isVisible && <div className={`status-message ${type}`}>{message}</div>}
    </>
  );
};

export default StatusMessages;