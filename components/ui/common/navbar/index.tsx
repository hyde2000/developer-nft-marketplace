import { FC } from "react";

import { Button, ActiveLink } from "@components/ui/common";
import { useWeb3 } from "@components/providers";
import { useAccount } from "@components/hooks/useAccount";

const NavBar: FC = () => {
  const { connect, isLoading, requireInstall } = useWeb3();

  const { account } = useAccount();

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex justify-between items-center">
            <div>
              <ActiveLink
                href="/"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                value="Home"
              />
              <ActiveLink
                href="/marketplace"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                value="Marketplace"
              />
              <ActiveLink
                href="/blog"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                value="Blog"
              />
            </div>
            <div>
              <ActiveLink
                href="/wishlist"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                value="Wishlist"
              />
              {isLoading ? (
                <Button
                  disabled={true}
                  onClick={connect}
                  className="text-black bg-white hover:bg-white"
                >
                  Loading...
                </Button>
              ) : account.data ? (
                <Button hoverable={false} className="cursor-default">
                  Hi there {account.isAdmin && "Admin"}
                </Button>
              ) : requireInstall ? (
                <Button
                  onClick={() =>
                    window.open("https://metamask.io/download.html", "_blank")
                  }
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Install Metamask
                </Button>
              ) : (
                <Button onClick={connect}>Connect</Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default NavBar;
