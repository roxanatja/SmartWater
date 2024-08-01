import { createContext, useState } from "react";

type FilterContextType = {
  applicatedFilters: boolean;
  setApplicatedFilters: React.Dispatch<React.SetStateAction<boolean>>;
  notApplicatedFilters: boolean;
  setNotApplicatedFilters: React.Dispatch<React.SetStateAction<boolean>>;
  fromDate: string;
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
  toDate: string;
  setToDate: React.Dispatch<React.SetStateAction<string>>;
  withLoans: boolean;
  setWithLoans: React.Dispatch<React.SetStateAction<boolean>>;
  withoutLoans: boolean;
  setWithoutLoans: React.Dispatch<React.SetStateAction<boolean>>;
  withCredit: boolean;
  setWithCredit: React.Dispatch<React.SetStateAction<boolean>>;
  withoutCredit: boolean;
  setWithoutCredit: React.Dispatch<React.SetStateAction<boolean>>;
  dealers: Array<string>;
  setDealers: React.Dispatch<React.SetStateAction<Array<string>>>;
  zone: Array<string>;
  setZone: React.Dispatch<React.SetStateAction<Array<string>>>;
  daysToRenew: number;
  setDaysToRenew: React.Dispatch<React.SetStateAction<number>>;
  daysSinceRenewed: number;
  setDaysSinceRenewed: React.Dispatch<React.SetStateAction<number>>;
};

export const FilterContext = createContext<FilterContextType>(
  {} as FilterContextType
);

export const FilterProvider = ({ children }: any) => {
  const [applicatedFilters, setApplicatedFilters] = useState<boolean>(false);
  const [notApplicatedFilters, setNotApplicatedFilters] =
    useState<boolean>(false);
  const [zone, setZone] = useState<Array<string>>([]);
  const [dealers, setDealers] = useState<Array<string>>([]);
  const [withLoans, setWithLoans] = useState<boolean>(false);
  const [withoutLoans, setWithoutLoans] = useState<boolean>(false);
  const [withCredit, setWithCredit] = useState<boolean>(false);
  const [withoutCredit, setWithoutCredit] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [daysToRenew, setDaysToRenew] = useState<number>(0);
  const [daysSinceRenewed, setDaysSinceRenewed] = useState<number>(0);

  return (
    <FilterContext.Provider
      value={{
        applicatedFilters,
        setApplicatedFilters,
        notApplicatedFilters,
        setNotApplicatedFilters,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        withoutLoans,
        setWithoutLoans,
        withLoans,
        setWithLoans,
        withCredit,
        setWithCredit,
        withoutCredit,
        setWithoutCredit,
        dealers,
        setDealers,
        zone,
        setZone,
        daysToRenew,
        setDaysToRenew,
        daysSinceRenewed,
        setDaysSinceRenewed,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
