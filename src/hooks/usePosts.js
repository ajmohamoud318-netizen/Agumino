import { useEffect, useState } from "react";
import { STORAGE_KEYS, loadStoredPosts, saveStoredArray } from "../services/storage";
import { makePostId } from "../utils/helpers";

export function usePosts() {
  const [posts, setPosts] = useState(loadStoredPosts);

  useEffect(() => {
    saveStoredArray(STORAGE_KEYS.posts, posts);
  }, [posts]);

  const createPost = (childName, imageURL, frameURL, composition) => {
    setPosts((prev) => [
      {
        id: makePostId(),
        childName,
        imageURL,
        frameURL,
        composition,
        liked: false,
        likeCount: 1,
        comments: [],
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likeCount: Math.max(0, (post.likeCount ?? 1) + (liked ? 1 : -1)),
        };
      })
    );
  };

  const addComment = (postId, text) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [
            ...(post.comments || []),
            {
              id: makePostId(),
              author: "Kullanıcı",
              text,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const updatePostFrame = (postId, frameURL, composition) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, frameURL, composition } : post))
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return { posts, createPost, toggleLike, addComment, updatePostFrame, deletePost };
}
