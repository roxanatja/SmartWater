"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { ShaperonIcon } from "../icons/Icons";

type ItemSub = {
  id: number;
  titulo: string;
  to: string;
  icon?: React.ReactNode;
};

type Item = {
  tituloItem: string;
  icon?: React.ReactNode;
  to: string;
  opciones?: Array<ItemSub>;
};

const AsideItem = ({ tituloItem, icon, to }: Item) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to}>
      <Button
        className={`flex items-center justify-between w-full text-left ${
          isActive ? "bg-white text-black" : ""
        }`}
      >
        <div className="flex items-center flex-grow">
          {icon && (
            <span className={isActive ? "text-black" : "text-white"}>
              {icon}
            </span>
          )}
          <span className="ml-2 flex-grow flex-wrap text-wrap">
            {tituloItem}
          </span>
        </div>
      </Button>
    </Link>
  );
};

const AsideSubMenu = ({ tituloItem, icon, opciones, to }: Item) => {
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);
  const pathname = usePathname();

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const isActive = opciones?.some((opcion) => pathname === opcion.to);

  return (
    <>
      <Button
        className={`flex items-center justify-between w-full text-left ${
          isActive ? "bg-white text-black" : ""
        }`}
        onClick={handleOpcionesClick}
      >
        <div className="flex items-center flex-grow">
          {icon}
          <span className="ml-2 flex-grow">{tituloItem}</span>
        </div>
        <ShaperonIcon
          className={`transform ${opcionesVisibles ? "rotate-180" : ""}`}
        />
      </Button>
      {opcionesVisibles && opciones && opciones.length > 0 && (
        <div className="ml-4 mt-2 space-y-2">
          {opciones.map((opcion) => (
            <Link key={opcion.id} href={opcion.to}>
              <Button
                className={`flex items-center justify-between w-full text-left ${
                  pathname === opcion.to ? "bg-white text-black" : ""
                }`}
              >
                <div className="flex items-center flex-grow">
                  {opcion.icon}
                  <span className="ml-2 flex-grow">{opcion.titulo}</span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export { AsideItem, AsideSubMenu };
