import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import PostBoxUI from "../components/commons/postbox/PostBoxUI";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Tyler</title>
      </Head>
      {/* Post Box */}
      <PostBoxUI />
      <div>
        {/* Feed */}
        <div></div>
      </div>
    </div>
  );
};

export default Home;
