import { useQuery } from "@apollo/client";
import React from "react";
import {
  GET_ALL_POST,
  GET_ALL_POSTS_BY_TOPIC,
} from "../../utils/apollo/graphql/queries";
import PostUI from "../post/PostUI";

type Props = {
  topic?: string;
};

const FeedUI = ({ topic }: Props) => {
  const { data, error } = !topic
    ? useQuery(GET_ALL_POST)
    : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: {
          topic: topic,
        },
      });

  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic;

  return (
    <div className="mt-5 space-y-4 w-full">
      {posts?.map((post) => (
        <PostUI key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedUI;
