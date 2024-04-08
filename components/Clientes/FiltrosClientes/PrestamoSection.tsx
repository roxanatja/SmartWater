import { FC, useState } from "react";
import { ShaperonIcon } from "@/components/icons/Icons";
import {
  ConprestamoIcon,
  SinprestamoIcon,
  DineroIcon,
  SinDinero,
} from "@/components/icons/Icons";
import useAppStore from "@/store/appStore";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

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
  const HandleHasExpiredContrats = (checked: boolean) => {
    setFilters({ ...filters, hasExpiredContracts: checked });
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
          <div className="grid grid-cols-2 gap-4">
            <CustomCheckbox
              checked={filters.withLoans}
              onCheckedChange={handleWithLoansChange}
              label="Tiene préstamo"
              icon={<ConprestamoIcon />}
            />
            <CustomCheckbox
              checked={filters.hasExpiredContracts}
              onCheckedChange={HandleHasExpiredContrats}
              label="Contratos Vencidos"
              // icon={<ConprestamoIcon />}
            />
            <CustomCheckbox
              checked={filters.withoutLoans}
              onCheckedChange={handleWithoutLoansChange}
              label="No tiene préstamo"
              icon={<SinprestamoIcon />}
            />
          </div>
          <h2>Cuentas por cobrar</h2>

          <CustomCheckbox
            checked={filters.withCredit}
            onCheckedChange={handleWithCreditChange}
            label="Tiene créditos"
            icon={<DineroIcon className="text-blue-800" />}
          />
          <CustomCheckbox
            checked={filters.withoutCredit}
            onCheckedChange={handleWithoutCreditChange}
            label="No tiene créditos"
            icon={<SinDinero className="text-blue-800" />}
          />
        </div>
      )}
    </div>
  );
};
