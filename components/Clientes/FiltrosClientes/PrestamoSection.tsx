import { FC, useState, useEffect } from "react";
import { AppState } from "@/store/appStore";
import { ShaperonIcon } from "@/components/icons/Icons";
import {
  ConprestamoIcon,
  SinprestamoIcon,
  DineroIcon,
  SinDinero,
} from "@/components/icons/Icons";

export const PrestamoSection: FC<{
  selectedFilters: AppState["filters"];
  setSelectedFilters: (filters: AppState["filters"]) => void;
}> = ({ selectedFilters, setSelectedFilters }) => {
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);
  const [withLoans, setWithLoans] = useState<boolean>(
    selectedFilters.withLoans
  );
  const [withoutLoans, setWithoutLoans] = useState<boolean>(
    selectedFilters.withoutLoans
  );
  const [withCredit, setWithCredit] = useState<boolean>(
    selectedFilters.withCredit
  );
  const [withoutCredit, setWithoutCredit] = useState<boolean>(
    selectedFilters.withoutCredit
  );

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const handleWithLoansChange = (checked: boolean) => {
    setWithLoans(checked);
    setWithoutLoans(false);
  };

  const handleWithoutLoansChange = (checked: boolean) => {
    setWithoutLoans(checked);
    setWithLoans(false);
  };

  const handleWithCreditChange = (checked: boolean) => {
    setWithCredit(checked);
    setWithoutCredit(false);
  };

  const handleWithoutCreditChange = (checked: boolean) => {
    setWithoutCredit(checked);
    setWithCredit(false);
  };

  useEffect(() => {
    setWithLoans(selectedFilters.withLoans);
    setWithoutLoans(selectedFilters.withoutLoans);
    setWithCredit(selectedFilters.withCredit);
    setWithoutCredit(selectedFilters.withoutCredit);
  }, [selectedFilters]);
  
  useEffect(() => {
    setSelectedFilters({
      ...selectedFilters,
      withLoans,
      withoutLoans,
      withCredit,
      withoutCredit,
    });
  }, [withLoans, withoutLoans, withCredit, withoutCredit, selectedFilters, setSelectedFilters]);

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
                checked={withLoans}
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
                checked={withoutLoans}
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
                checked={withCredit}
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
                checked={withoutCredit}
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
