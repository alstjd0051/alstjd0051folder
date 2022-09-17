import Link from "next/link";
import React from "react";

const SkillPage = () => {
  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Link href={"https://minseongfolio2022-2d8e6.web.app/"}>
        <div className="flex flex-col cursor-pointer">
          <h1 className="font-bold text-2xl text-blue-400">React</h1>
          <p>Click To Here</p>
        </div>
      </Link>
    </div>
  );
};

export default SkillPage;
