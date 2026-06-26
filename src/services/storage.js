import { DEFAULT_COMPOSITION } from "../utils/helpers";

export const STORAGE_KEYS = {
  children: "agumino.children",
  posts: "agumino.posts",
};

export const loadStoredArray = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

export const saveStoredArray = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Agumino could not save locally:", error);
  }
};

export const loadStoredPosts = () =>
  loadStoredArray(STORAGE_KEYS.posts).map((post, index) => ({
    ...post,
    id: post.id || `saved-${index}-${post.childName || "post"}`,
    composition: post.composition || DEFAULT_COMPOSITION,
    createdAt: post.createdAt || new Date().toISOString(),
    liked: Boolean(post.liked),
    likeCount: post.likeCount ?? 1,
    comments: post.comments || [],
  }));
