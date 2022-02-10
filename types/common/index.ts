export type LinkType = {
  href: string;
  value: string;
  requireAdmin?: boolean;
};

export type OrderType = {
  price: string;
  email: string;
  confirmEmail: string;
};

export type OwnedCourseType = {
  id: number;
  price: string;
  proof: string;
  owner: string;
  state: number;
};

export type NormalizedOwnedCourseType = {
  id: string;
  type: string;
  title: string;
  description: string;
  coverImage: string;
  author: string;
  link: string;
  slug: string;
  wsl: string[];
  createdAt: string;
  ownedCourseID: number;
  proof: string;
  price?: string;
  state: string;
};

export type NormalizedManagedCourseType = {
  ownedCourseID: number;
  proof: string;
  price?: string;
  state: string;
  hash: string;
};
