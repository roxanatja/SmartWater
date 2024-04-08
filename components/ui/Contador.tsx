// Contado
import React from "react";
import { Plus, Minus } from "lucide-react";

interface CounterProps {
  count: number;
  setCount: (newCount: number) => void; // Esto debe ser una función que toma un número directamente
}

const Contador: React.FC<CounterProps> = ({ count, setCount }) => {
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <div className="flex items-center">
      <button
        className="border-blue-500 border-2 text-blue-800 p-0.5 rounded-full"
        onClick={decrement}
        disabled={count === 0}
      >
        <Minus className="w-4 h-4 text-bold " strokeWidth="3" />
      </button>
      <div className=" rounded-lg mx-4 border border-blue-500 text-center w-12">
        {count}
      </div>
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
