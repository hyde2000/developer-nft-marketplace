import { FC, ReactNode } from "react";

const SIZE = {
  sm: "p-2 text-base xs:px-4",
  md: "p-3 text-base xs:px-8",
  lg: "p-3 text-lg xs:px-8",
};

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  hoverable?: boolean;
  variant?: "purple" | "green" | "red" | "lightPurple" | "white";
  sizeClass?: "sm" | "md" | "lg";
};

const Button: FC<Props> = ({
  onClick,
  children,
  className = "text-white bg-indigo-600 hover:bg-indigo-700",
  disabled,
  hoverable = true,
  variant = "purple",
  sizeClass = "md",
}) => {
  const variants = {
    purple: `text-white bg-indigo-600 ${hoverable && "hover:bg-indigo-700"}`,
    green: `text-white bg-green-600 ${hoverable && "hover:bg-green-700"}`,
    red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${
      hoverable && "hover:bg-indigo-200"
    }`,
    white: "text-black bg-white",
  };

  const size = SIZE[sizeClass];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${size} disabled:opacity-50 disabled:cursor-not-allowed border rounded-md font-medium ${className} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
