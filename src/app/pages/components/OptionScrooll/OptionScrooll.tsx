import React, { useEffect, useState } from 'react';
import './OptionScrooll.css';

interface CustomSelectProps {
    options: string[];
    onOptionChange: (selectedOption: string) => void;
}

const OptionScrooll: React.FC<CustomSelectProps> = ({ options, onOptionChange }) => {
    const [selectedOption, setSelectedOption] = useState(0);

    const handleUpClick = () => {
        setSelectedOption((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleDownClick = () => {
        setSelectedOption((prev) => (prev < options.length - 1 ? prev + 1 : prev));
    };

    useEffect(() => {
        onOptionChange(options[selectedOption]);
    }, [selectedOption, options, onOptionChange]);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.deltaY < 0) {
        handleUpClick();
        } else if (e.deltaY > 0) {
        handleDownClick();
        }
    };

    return (
        <div className="OptionScrooll-select" onWheel={handleWheel}>
            <span>{options[selectedOption]}</span>
            <button className='OptionScrooll-btn' onClick={handleDownClick}>
                <span className="material-symbols-outlined">
                    expand_more
                </span>
            </button>
            <div className="Option next">
                {options[selectedOption + 1]}
            </div>
        </div>
    );
};

export{OptionScrooll};