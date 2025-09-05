import { STYLE_OPTIONS_MINI } from "@/const";
import { StyleSelectorProps } from "@/types";
import { ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, isOpen, onToggle }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only add event listeners when dropdown is open
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onToggle();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                onToggle();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const handleKeyDown = (e: React.KeyboardEvent, style: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onStyleChange(style);
            onToggle();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={onToggle}
                        aria-hidden="true"
                    />
                    <div
                        className="absolute bottom-full left-0 mb-2 z-20 min-w-[200px] bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                        role="listbox"
                        aria-label="Select a style"
                    >
                        <div className="p-2">
                            {STYLE_OPTIONS_MINI.map((style) => (
                                <button
                                    key={style.value}
                                    type="button" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onStyleChange(style.value);
                                        onToggle();
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, style.value)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${selectedStyle === style.value
                                            ? "bg-orange-500 text-white"
                                            : "hover:bg-white/10 text-white/80 hover:text-white"
                                        }`}
                                    role="option"
                                    aria-selected={selectedStyle === style.value}
                                    tabIndex={0}
                                >
                                    <span className="text-base">{style.emoji}</span>
                                    <span className="flex-1 text-left">{style.label}</span>
                                    {selectedStyle === style.value && (
                                        <div
                                            className="w-2 h-2 bg-white rounded-full"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <button
                type="button" 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={`Selected style: ${STYLE_OPTIONS_MINI.find((s) => s.value === selectedStyle)?.label
                    }. Click to change style`}
            >
                <span className="text-lg">
                    {STYLE_OPTIONS_MINI.find((s) => s.value === selectedStyle)?.emoji}
                </span>
                <span>
                    {STYLE_OPTIONS_MINI.find((s) => s.value === selectedStyle)?.label} Style
                </span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>
        </div>
    );
};

export default StyleSelector;