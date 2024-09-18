import React, { useCallback, useEffect, useState } from "react";
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
  const [active, setActive] = useState(true);
  const [active2, setActive2] = useState(true);

  const handleUpClick = () => {
    setSelectedOption((prev) => (prev > 0 ? prev - 1 : prev));
    setActive(true);
  };

  const handleDownClick = () => {
    setSelectedOption((prev) => (prev < options.length - 1 ? prev + 1 : prev));
    setActive(true);
  };

  const handleOptionChange = useCallback(() => {
    if (active) {
      onOptionChange(options[selectedOption]);
      setTimeout(
        () => {
          setActive(false);
          setActive2(false);
        },
        active2 ? 1000 : 0
      );
    }
  }, [active, active2, onOptionChange, options, selectedOption]);

  useEffect(() => {
    handleOptionChange();
  }, [handleOptionChange]);

  return (
    <div className="OptionScrooll-select relative">
      {/* Button for scrolling up */}
      <button
        className="OptionScrooll-btn"
        type="button"
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
        className={` ${className}`}
      >
        {options[selectedOption]}
      </motion.div>

      {/* Option below */}
      {selectedOption < options.length - 1 && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-50 translate-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`${className} pointer-events-none`}
          >
            {options[selectedOption + 1]}
          </motion.div>
        </div>
      )}

      {/* Button for scrolling down */}
      <button
        className="OptionScrooll-btn"
        type="button"
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
