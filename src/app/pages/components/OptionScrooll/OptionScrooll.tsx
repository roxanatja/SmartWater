import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./OptionScrooll.css";

interface CustomSelectProps {
  options: string[];
  onOptionChange: (selectedOption: string) => void;
  className?: string;
}

const OptionScrooll: React.FC<CustomSelectProps> = ({
  options,
  onOptionChange,
  className,
}) => {
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

  return (
    <div className="OptionScrooll-select">
      <button
        className="OptionScrooll-btn"
        onClick={handleUpClick}
        style={{ opacity: selectedOption === 0 ? "0.2" : "" }}
      >
        <span className="material-symbols-outlined">expand_less</span>
      </button>

      {/* Animated option */}
      <motion.div
        key={selectedOption}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {options[selectedOption]}
      </motion.div>

      <button
        className="OptionScrooll-btn"
        onClick={handleDownClick}
        style={{
          opacity: selectedOption === options.length - 1 ? "0.2" : "",
        }}
      >
        <span className="material-symbols-outlined">expand_more</span>
      </button>
    </div>
  );
};

export { OptionScrooll };
