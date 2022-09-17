import { LinkIcon, PhotographIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import AvatarUI from "../avatar/AvatarUI";
import { useForm } from "react-hook-form";
import { FormData } from "../../utils/type/type";
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_SUBREDDIT } from "../../utils/apollo/graphql/mutations";
import client from "../../utils/apollo/apollo-client";
import {
  GET_ALL_POST,
  GET_SUBREDDIT_BY_TOPIC,
} from "../../utils/apollo/graphql/queries";
import toast from "react-hot-toast";

type Props = {
  subreddit?: string;
};

const PostBoxUI = ({ subreddit }: Props) => {
  console.log(subreddit);
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POST, "getPostList"],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);

  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);

  /**
   * React hook form
   */
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const notification = toast.loading("Creating new Post...");
    try {
      // Query for the subreddit topic
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      });
      const subredditExists = getSubredditListByTopic.length > 0;
      if (!subredditExists) {
        // create subreddit...
        console.log("Subreddit is new! -> creating a NEW subreddit");
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });

        console.log("Creating post...", formData);
        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        console.log("New Post added: ", newPost);
      } else {
        // use Existing subredditExists.valueOf..
        console.log("Using existing subreddit");
        console.log(getSubredditListByTopic);

        const image = formData.postImage || "";
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        console.log("new Post added: ", newPost);
      }

      // After the post has been added
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("subreddit", "");
      toast.success("New Post Created", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whooops", {
        id: notification,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2 "
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <AvatarUI />

        <input
          {...register("postTitle", { required: true })}
          className="rounded-md flex-1 bg-gray-50 p-2 pl-5 outline-none "
          type="text"
          disabled={!session}
          placeholder={
            session
              ? subreddit
                ? `Create a post in ${subreddit}`
                : `Please write something`
              : "Sign In"
          }
        />

        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && "text-blue-300"
          } `}
        />
        <LinkIcon className={"h-6 text-gray-300  "} />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px] ">Body : </p>
            <input
              {...register("postBody")}
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              type="text"
              placeholder="Text (Optional) "
            />
          </div>
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px] ">Your Number : </p>
              <input
                {...register("subreddit", { required: true })}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="number"
                placeholder="Please leave your contact information"
              />
            </div>
          )}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px] ">Image URL : </p>
              <input
                {...register("postImage")}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}
          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>A Post Title is required</p>
              )}
              {errors.subreddit?.type === "required" && (
                <p>A Subreddit is required</p>
              )}
            </div>
          )}

          {watch("postTitle") && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default PostBoxUI;
