import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import AvatarUI from "../avatar/AvatarUI";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { Jelly, Orbit } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_VOTES_BY_POST_ID } from "../../utils/apollo/graphql/queries";
import { ADD_VOTE } from "../../utils/apollo/graphql/mutations";
import { totalmem } from "os";

type Props = {
  post: Post;
};

const PostUI = ({ post }: Props) => {
  const [vote, setVote] = useState<boolean>();
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast("❗You'll need to sign in to vote!");
      return;
    }

    if (vote && isUpvote) return;
    if (vote === false && !isUpvote) return;
    console.log("voting...", isUpvote);
    const {
      data: { insertVote: newVote },
    } = await addVote({
      variables: {
        post_id: post.id,
        username: session?.user?.name,
        upvote: isUpvote,
      },
    });
  };

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;
    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }
    return displayNumber;
  };

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    );
  return (
    <>
      <div className="flex cursor-pointer rounded-md  border border-gray-300 bg-white shadow hover:border hover:border-gray-600 ">
        {/* Votes */}
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400 ">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButton hover:text-red-400 ${
              vote && "text-red-400"
            }`}
          />
          <p className="text-black font-bold text-xs">{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButton hover:text-blue-400 ${
              vote === false && "text-blue-400"
            } `}
          />
        </div>

        <Link href={`/post/${post?.id}`}>
          <div className="p-3 pb-1">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <AvatarUI seed={post.subreddit[0]?.topic} />
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                <p className="text-xs text-gray-400">
                  💌&nbsp;
                  <span className="font-bold text-black hover:text-blue-400 hover:underline">
                    {post.username}
                  </span>
                  <TimeAgo date={post.created_at} />
                </p>
              </Link>
            </div>

            {/* Body */}
            <div className="py-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm font-light">{post.body}</p>
            </div>

            {/* Image */}
            <img className="w-full" src={post.image} alt="" />
            {/* Footer */}
            <div className="flex space-x-4 text-gray-400">
              <div className="postButton">
                <ChatAltIcon className="h-6 w-6" />
                <p className="">{post.comments.length} Comments</p>
              </div>
              <div className="postButton">
                <GiftIcon className="h-6 w-6" />
                <p className="hidden sm:inline">{post.comments.length} Award</p>
              </div>
              <div className="hidden sm:inlinepostButton">
                <ShareIcon className="h-6 w-6" />
                <p className="hidden sm:inline">{post.comments.length} Share</p>
              </div>
              <div className="postButton">
                <BookmarkIcon className="h-6 w-6" />
                <p className="hidden sm:inline">{post.comments.length} Save</p>
              </div>
              <div className="postButton">
                <DotsHorizontalIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default PostUI;
