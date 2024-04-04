import { CampanaIcon } from "../icons/Icons";

type Item = {
  titulo: string;
  icon?: React.ReactNode;
};

export const PageTitle = ({ titulo, icon }: Item) => {
  return (
    <div className="flex justify-between items-center  m-5">
      <div className="flex items-center">
        {icon && <>{icon}</>}
        <h1 className="ml-4 text-3xl font-bold">{titulo}</h1>
      </div>
      <div className="relative">
        <CampanaIcon />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white">!</span>
        </div>
      </div>
    </div>
  );
};
