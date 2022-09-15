import Image from "next/image";
import React from "react";
import {
  BeakerIcon,
  ChevronDownIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { StarIcon } from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm ">
      <Link href="/">
        <div className="relative h-14 w-20 object-cover flex-shrink-0 cursor-pointer">
          <Image
            src="https://avatars.githubusercontent.com/u/70365399?v=4"
            layout="fill"
            objectFit="contain"
            className="rounded-full"
          />
        </div>
      </Link>

      <div className="flex items-center mx-7 xl:min-w-[150px] ">
        <HomeIcon className="h-5 w-5" />
        <p className="flex-1 ml-2 hidden lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      {/* Search Box */}
      <form className="flex flex-1 items-center space-x-2 border border-gray-200 rounded-full bg-gray-100 px-3 py-1">
        <SearchIcon className="h-6 w-6 text-gray-400 " />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search..."
        />
        <button type="submit" hidden />
      </form>
      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon className="icon" />
      </div>

      {/* Sign In/Out */}
      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden lg:flex items-center space-x-2  p-2 cursor-pointer  border"
        >
          {session.user?.image ? (
            <img
              className="rounded-full w-10 h-10 "
              src={session.user.image}
              alt=""
            />
          ) : (
            /* none Image */
            <div className="bg-gray-500 rounded-full w-10 h-10" />
          )}
          <div className="flex flex-col items-center justify-center">
            <p className="font-bold">{session.user?.name}</p>
            <p className="text-gray-600">Sign Out</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden lg:flex items-center space-x-2  p-2 cursor-pointer "
        >
          <p className="text-gray-600">Sign In</p>
        </div>
      )}
    </div>
  );
};

export default Header;
