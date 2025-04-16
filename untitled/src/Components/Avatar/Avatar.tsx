// src/components/ui/avatar.tsx
import React from 'react';
import "./avatar.css"

interface AvatarProps {
    src: string;
    alt: string;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, className }) => {
    return (
        <img
            className={`rounded-full ${className}`}
            src={src}
            alt={alt}
            width={100}
            height={100}
        />
    );
};
