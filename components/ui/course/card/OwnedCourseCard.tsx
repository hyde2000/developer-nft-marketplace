import Image from "next/image";
import { FC, ReactNode } from "react";

import { NormalizedOwnedCourseType } from "types/common";

type Props = {
  children: ReactNode;
  ownedCourse: NormalizedOwnedCourseType;
};

const OwnedCourseCard: FC<Props> = ({ children, ownedCourse }) => {
  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="flex">
        <div className="flex-1">
          <div className="h-full next-image-wrapper">
            <Image
              className="object-cover"
              src={ownedCourse.coverImage}
              width="45"
              height="45"
              layout="responsive"
            />
          </div>
        </div>
        <div className="flex-4">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {ownedCourse.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {ownedCourse.price} ETH
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-9 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Course ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {ownedCourse.ownedCourseID}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-9 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Proof</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {ownedCourse.proof}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:px-6">{children}</div>
        </dl>
      </div>
    </div>
  );
};

export default OwnedCourseCard;
