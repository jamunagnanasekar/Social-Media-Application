import API from "../axios";

// Toggle Bookmark
export const toggleBookmark = async (postId) => {
  const response = await API.post(`/bookmarks/${postId}`);
  return response.data;
};

// Get Saved Posts
export const getBookmarks = async () => {
  const response = await API.get("/bookmarks");
  return response.data;
};