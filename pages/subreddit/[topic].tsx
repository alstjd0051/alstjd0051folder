import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import AvatarUI from "../../components/commons/avatar/AvatarUI";
import FeedUI from "../../components/commons/feed/FeedUI";
import PostBoxUI from "../../components/commons/postbox/PostBoxUI";

const Subreddit = () => {
  const {
    query: { topic, id },
  } = useRouter();
  return (
    <div className={`h-24 bg-red-400 p-8`}>
      <div className="-mx-8 mt-10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center space-x-4 pb-3 ">
          <div className="-mt-5">
            <AvatarUI seed={topic as string} large />
          </div>
          <div className="py-2">
            <h1 className="text-3xl font-semibold">Welcome to the {topic} </h1>
            <p className="text-sm text-gray-400">{topic}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl pb-10 ">
        <PostBoxUI subreddit={id as string} />
        <FeedUI topic={id as string} />
      </div>
    </div>
  );
};

export default Subreddit;
