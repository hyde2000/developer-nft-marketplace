import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  hoverable?: boolean;
  variant?: "purple" | "green" | "red" | "lightPurple" | "white";
};

const Button: FC<Props> = ({
  onClick,
  children,
  className = "text-white bg-indigo-600 hover:bg-indigo-700",
  hoverable = true,
  variant = "purple",
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

  return (
    <button
      onClick={onClick}
      className={`disabled:opacity-50 disabled:cursor-not-allowed xs:px-8 xs:py-3 p-2 border rounded-md text-base font-medium ${className} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
