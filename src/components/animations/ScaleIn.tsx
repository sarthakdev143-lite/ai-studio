import { AnimationProps } from "@/types";
import { useState, useEffect } from "react";

const ScaleIn: React.FC<AnimationProps> = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-500 ease-out ${isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
                } ${className}`}
        >
            {children}
        </div>
    );
};

export default ScaleIn;