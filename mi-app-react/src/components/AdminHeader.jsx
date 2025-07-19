import React from 'react';
import clockIcon from '../assets/Caracol_Televisión_logo.svg.png';

const AdminHeader = () => {
    return (
        <div className="admin-header">
            <div className="admin-logo-container">
                <img src={clockIcon} alt="Logo" className="admin-logo" />
            </div>
        </div>
    );
};

export default AdminHeader;