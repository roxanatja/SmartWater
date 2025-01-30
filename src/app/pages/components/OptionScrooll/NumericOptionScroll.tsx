import React, { useCallback, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import "./OptionScrooll.css";

interface CustomSelectProps {
    options?: string[];
    onOptionChange: (selectedOption: string) => void;
    className?: string;
    containerClassName?: string;
    value?: number;
    numeric?: {
        min?: number;
        max: number;
        isDecimal: boolean;
    }
}

const NumericOptionScrooll = memo<CustomSelectProps>(({ options, onOptionChange, className, value, numeric, containerClassName }) => {
    const [selectedOption, setSelectedOption] = useState(0);
    const [active, setActive] = useState(true);
    const [active2, setActive2] = useState(true);
    const [localOptions, setLocalOptions] = useState<string[]>([])

    const handleUpClick = () => {
        setSelectedOption((prev) => (prev > 0 ? prev - 1 : prev));
        setActive(true);
    };

    const handleDownClick = () => {
        setSelectedOption((prev) => (prev < localOptions.length - 1 ? prev + 1 : prev));
        setActive(true);
    };

    useEffect(() => {
        if (options) {
            setLocalOptions(options)
        } else {
            if (numeric && numeric.max) {
                setLocalOptions(Array.from({ length: numeric.max - (numeric.min || 0) + 1 }, (_, i) => String((numeric.min || 0) + i).padStart(numeric.isDecimal ? 2 : 1, "0")))
            }
        }
    }, [options, numeric])

    useEffect(() => {
        if (value !== undefined) setSelectedOption(value);
    }, [value]);

    const handleOptionChange = useCallback(() => {
        if (active) {
            onOptionChange(localOptions[selectedOption]);
            setTimeout(
                () => {
                    setActive(false);
                    setActive2(false);
                },
                active2 ? 1000 : 0
            );
        }
    }, [active, active2, onOptionChange, localOptions, selectedOption]);

    useEffect(() => {
        handleOptionChange();
    }, [handleOptionChange]);

    return (
        <div className={`OptionScrooll-select relative ${containerClassName}`}>
            {/* Button for scrolling up */}
            <button
                tabIndex={-1}
                className="OptionScrooll-btn"
                type="button"
                onClick={handleUpClick}
                style={{ opacity: selectedOption === 0 ? "0.2" : "" }}
            >
                <span className="material-symbols-outlined">expand_less</span>
            </button>

            {/* Animated option */}
            <input
                type="number"
                // key={selectedOption}
                // initial={{ opacity: 0, y: -10 }}
                // animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: 10 }}
                // transition={{ duration: 0.3 }}
                className={`bg-transparent w-full max-w-[50px] text-center no-spinner ${className}`}
                value={localOptions[selectedOption]}
                onChange={(e) => {
                    const val = parseInt(e.target.value)
                    const idx = localOptions.findIndex(o => Number(o) === val)
                    if (idx !== -1) {
                        setSelectedOption(idx)
                        setActive(true)
                    }
                }}
            />

            {/* Option below */}
            {selectedOption < localOptions.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-50 translate-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className={`${className} pointer-events-none`}
                    >
                        {localOptions[selectedOption + 1]}
                    </motion.div>
                </div>
            )}

            {/* Button for scrolling down */}
            <button
                tabIndex={-1}
                className="OptionScrooll-btn"
                type="button"
                onClick={handleDownClick}
                style={{
                    opacity: selectedOption === localOptions.length - 1 ? "0.2" : "",
                }}
            >
                <span className="material-symbols-outlined">expand_more</span>
            </button>
        </div>
    );
});

export { NumericOptionScrooll };
