export type LinkType = {
  href: string;
  value: string;
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
  state: 0 | 1 | 2;
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
