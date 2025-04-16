import React from 'react';
import "./button.css";
import { motion } from "framer-motion";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
    <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        {...props}
    >
        {children}
    </motion.button>
);

export default Button;
