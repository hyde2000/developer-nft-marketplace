import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

type Props = {
  className?: string;
  activeClass?: string;
  href: string;
  value: string;
};

export const ActiveLink: FC<Props> = ({
  className,
  activeClass,
  href,
  value,
}) => {
  const { pathname } = useRouter();

  if (pathname === href) {
    className = `${className} ${activeClass ? activeClass : "text-indigo-600"}`;
  }

  return (
    <Link href={href}>
      <a className={className}>{value}</a>
    </Link>
  );
};

export default ActiveLink;
