import React from 'react';
import {MobileHome} from './MobileHome';
import './mobile.css';

export const MobileApp: React.FC = () => {
  return (
    <div className="mobile-container">
      <MobileHome />
    </div>
  );
};