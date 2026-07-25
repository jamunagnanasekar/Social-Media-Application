import API from "../axios";

export const getComments = async (postId) => {
  const response = await API.get(`/comments/${postId}`);
  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await API.post(`/comments/${postId}`, {
    text,
  });

  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}`);
  return response.data;
};