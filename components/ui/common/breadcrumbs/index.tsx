import { FC } from "react";
import { LinkType } from "types/common";
import { ActiveLink } from "@components/ui/common";

type Props = {
  links: LinkType[];
};

const Breadcrumbs: FC<Props> = ({ links }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {links.map((link, i) => (
          <li
            key={link.href}
            className={`${
              i == 0 ? "pr-4" : "px-4"
            } font-medium text-gray-500 hover:text-gray-900`}
          >
            <ActiveLink href={link.href} value={link.value} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
