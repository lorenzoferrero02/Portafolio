// src/components/ui/card.tsx
import React from 'react';
import "./card.css";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};
