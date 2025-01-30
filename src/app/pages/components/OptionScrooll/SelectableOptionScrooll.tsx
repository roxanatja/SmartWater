import React, { useCallback, useEffect, useState, memo, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import "./OptionScrooll.css";

interface CustomSelectProps {
  options: string[];
  onOptionChange: (selectedOption: string) => void;
  className?: string;
  value?: number;
}

const SelectableOptionScrooll = memo<CustomSelectProps>((props) => {
  const { options, onOptionChange, className, value } = props;
  const [selectedOption, setSelectedOption] = useState(0);
  const [active, setActive] = useState(true);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [selectSearch, setSelectSearch] = useState<string>("");
  const [active2, setActive2] = useState(true);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleUpClick = () => {
    setSelectedOption((prev) => (prev > 0 ? prev - 1 : prev));
    setActive(true);
  };

  const handleDownClick = () => {
    setSelectedOption((prev) => (prev < options.length - 1 ? prev + 1 : prev));
    setActive(true);
  };

  useEffect(() => {
    if (value !== undefined) setSelectedOption(value);
  }, [value]);

  const handleOptionChange = useCallback(() => {
    if (active) {
      console.log(selectedOption)
      console.log(options[selectedOption])
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowSelect(false);
        setSelectSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const optionsFiltered = useMemo<string[]>(() => {
    if (selectSearch !== "") {
      return options.filter(o => o.toLowerCase().includes(selectSearch.toLowerCase()))
    } else {
      return options
    }
  }, [selectSearch, options])

  return (
    <div className="OptionScrooll-select relative">
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
      <div className="relative w-full">

        <motion.div
          key={selectedOption}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={`relative cursor-pointer ${className}`}
          onClick={() => setShowSelect(true)}
        >
          {options[selectedOption]}
        </motion.div>
        {
          showSelect &&
          <div ref={optionsRef} className="absolute top-full translate-y-3 left-1/2 -translate-x-1/2 w-fit h-auto max-h-[350px] rounded-[10px] bg-blocks border dark:border-blocks text-base flex flex-col text-start overflow-auto z-[100]">
            <div className="py-3 px-4 sticky top-0 w-full bg-blocks">
              <input type="text" className="w-full rounded-md bg-transparent outline-none border-2 border-black text-font-color px-2 py-1" placeholder="Buscar..." onChange={(e) => setSelectSearch(e.target.value)} />
            </div>
            {
              optionsFiltered.length > 0 && <>
                {optionsFiltered.map((o, index) => <div className="px-4 py-3 whitespace-nowrap hover:bg-gray-400 rounded-md cursor-pointer text-font-color" onClick={() => {
                  setSelectedOption(index)
                  setActive(true)
                  setShowSelect(false)
                  setSelectSearch("");
                }}>
                  {o}
                </div>)}
              </>
            }
            {
              optionsFiltered.length === 0 && <>
                Sin opciones
              </>
            }
          </div>
        }
      </div>

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
        tabIndex={-1}
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
});

export { SelectableOptionScrooll };
