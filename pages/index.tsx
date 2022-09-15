import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import FeedUI from "../components/commons/feed/FeedUI";
import PostBoxUI from "../components/commons/postbox/PostBoxUI";

const Home: NextPage = () => {
  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Head>
        <title>Tyler</title>
      </Head>
      {/* Post Box */}
      <PostBoxUI />
      <div className="flex">
        {/* Feed */}
        <FeedUI />
        <div></div>
      </div>
    </div>
  );
};

export default Home;
