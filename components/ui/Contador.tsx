import React, { ChangeEvent } from "react";
import { Plus, Minus } from "lucide-react";

interface CounterProps {
  count: number;
  setCount: (newCount: number) => void;
}

const Contador: React.FC<CounterProps> = ({ count, setCount }) => {
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  const handleCounterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setCount(Number(value));
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="border-blue-500 border-2 text-blue-800 p-0.5 rounded-full"
        onClick={decrement}
        disabled={count === 0}
      >
        <Minus className="w-4 h-4 text-bold" strokeWidth="3" />
      </button>
      <input
        type="text"
        className="rounded-lg mx-4 border border-blue-500 text-center w-12"
        value={count}
        onChange={handleCounterChange}
      />
      <button
        className="border-blue-500 border-2 text-blue-800 p-0.5 rounded-full"
        onClick={increment}
      >
        <Plus className="w-4 h-4" strokeWidth="3" />
      </button>
    </div>
  );
};

export default Contador;
