import { Check } from "lucide-react";
import * as Checkbox from "@radix-ui/react-checkbox";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  icon?: React.ReactNode;
}

const CustomCheckbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  label,
  icon,
}) => {
  return (
    <label className="flex items-center text-blue-800 font-semibold">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-4 w-4 border-2 border-black rounded mr-3 overflow-hidden focus:outline-none"
      >
        <Checkbox.Indicator className="flex items-center justify-center">
          <div className="w-5 h-5 items-center justify-center bg-blue-800 ">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        </Checkbox.Indicator>
      </Checkbox.Root>
      {icon && <span className="mr-4">{icon}</span>}
      {label}
    </label>
  );
};

export default CustomCheckbox;
