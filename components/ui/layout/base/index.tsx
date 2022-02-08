import { FC, ReactNode } from "react";
import Script from "next/script";

import { Footer, NavBar } from "@components/ui/common";
import { Web3Provider } from "@components/providers";

type Props = {
  children: ReactNode;
};

const BaseLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Script src="/js/truffle-contract.js" strategy="beforeInteractive" />
      <Web3Provider>
        <div className="relative max-w-7xl mx-auto px-4">
          <NavBar />
          <div className="fit">{children}</div>
        </div>
        <Footer />
      </Web3Provider>
    </>
  );
};

export default BaseLayout;
