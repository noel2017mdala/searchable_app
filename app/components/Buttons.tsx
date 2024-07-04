"use client";
import { useState, CSSProperties } from "react";
import { IconType } from "react-icons";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  label: string;
  action: () => void;
  fill?: boolean;
  bgColor?: string;
  disabled?: boolean;
  full?: boolean;
  icon?: IconType;
  loader?: boolean;
};

const Buttons = ({
  label,
  action,
  fill,
  full,
  disabled,
  icon: Icon,
  loader,
}: Props) => {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
  };
  return (
    <button
      className={`

  ${
    fill
      ? "bg-blue-600 text-white rounded-md"
      : "bg-white text-blue-600 rounded-md border border-blue-600"
  }
  relative
  disabled:opacity-70 
  disabled:cursor-not-allowed
  capitalize
  p-2
  cursor-pointer
  ${full ? "w-full" : "w-[120px]"}
  text-center
  text-sm
  `}
      onClick={action}
      disabled={loader ? loader : disabled}
    >
      {Icon && <Icon size={24} className="absolute left-12 " />}
      {loader ? (
        <ClipLoader
          color={"#ffffff"}
          loading={loader}
          cssOverride={override}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        label
      )}
    </button>
  );
};

export default Buttons;
