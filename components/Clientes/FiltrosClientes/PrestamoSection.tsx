import { FC, useState} from "react";
import { ShaperonIcon } from "@/components/icons/Icons";
import {
  ConprestamoIcon,
  SinprestamoIcon,
  DineroIcon,
  SinDinero,
} from "@/components/icons/Icons";
import useAppStore from "@/store/appStore";

export const PrestamoSection: FC = () => {
  const { filters, setFilters } = useAppStore();

  const handleWithLoansChange = (checked: boolean) => {
    setFilters({ ...filters, withLoans: checked, withoutLoans: false });
  };

  const handleWithoutLoansChange = (checked: boolean) => {
    setFilters({ ...filters, withoutLoans: checked, withLoans: false });
  };

  const handleWithCreditChange = (checked: boolean) => {
    setFilters({ ...filters, withCredit: checked, withoutCredit: false });
  };

  const handleWithoutCreditChange = (checked: boolean) => {
    setFilters({ ...filters, withoutCredit: checked, withCredit: false });
  };

  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  
  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between border-b pb-2 "
        onClick={handleOpcionesClick}
      >
        <h2 className="text-lg font-semibold">Préstamo & Creditos</h2>
        <button
          className={`focus:outline-none transition-transform ${
            opcionesVisibles ? "rotate-180" : ""
          }`}
        >
          <ShaperonIcon />
        </button>
      </div>
      {opcionesVisibles && (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex justify-center items-center w-14 h-14">
              <ConprestamoIcon />
            </div>
            <label className="m-3">
              <input
                type="checkbox"
                checked={filters.withLoans}
                onChange={(e) => handleWithLoansChange(e.target.checked)}
                className="mr-3"
              />
              Tiene préstamo
            </label>
          </div>
          <div className="flex items-center">
            <div className="flex justify-center items-center w-14 h-14">
              <SinprestamoIcon />
            </div>
            <label className="m-3">
              <input
                type="checkbox"
                checked={filters.withoutLoans}
                onChange={(e) => handleWithoutLoansChange(e.target.checked)}
                className="mr-3"
              />
              No tiene préstamo
            </label>
          </div>
          <div className="flex items-center">
            <div className="flex justify-center items-center w-14 h-14">
              <DineroIcon className="text-blue-800" />
            </div>
            <label className="ml-3">
              <input
                type="checkbox"
                checked={filters.withCredit}
                onChange={(e) => handleWithCreditChange(e.target.checked)}
                className="mr-3"
              />
              Tiene créditos
            </label>
          </div>
          <div className="flex items-center">
            <div className="flex justify-center items-center w-14 h-14">
              <SinDinero className="text-blue-800" />
            </div>
            <label className="ml-3">
              <input
                type="checkbox"
                checked={filters.withoutCredit}
                onChange={(e) => handleWithoutCreditChange(e.target.checked)}
                className="mr-3"
              />
              No tiene créditos
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
