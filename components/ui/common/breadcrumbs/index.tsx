import { FC, Fragment } from "react";
import { LinkType } from "types/common";

import { ActiveLink } from "@components/ui/common";

type BreadCrumbItemProps = {
  link: LinkType;
  index: number;
};

const BreadcrumbItem: FC<BreadCrumbItemProps> = ({ link, index }) => {
  return (
    <li
      className={`${
        index == 0 ? "pr-4" : "px-4"
      } font-medium text-gray-500 hover:text-gray-900`}
    >
      <ActiveLink value={link.value} href={link.href} />
    </li>
  );
};

type Props = {
  links: LinkType[];
  isAdmin?: boolean | "";
};

const Breadcrumbs: FC<Props> = ({ links, isAdmin }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {links.map((link, i) => (
          <Fragment key={link.href}>
            {!link.requireAdmin && <BreadcrumbItem link={link} index={i} />}
            {link.requireAdmin && isAdmin && (
              <BreadcrumbItem link={link} index={i} />
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
