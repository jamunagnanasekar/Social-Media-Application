import API from "../axios";

// Get profile by username
export const getUserProfile = async (username) => {
  const response = await API.get(`/users/profile/${username}`);
  return response.data;
};

// Update profile
export const updateProfile = async (formData) => {
  const response = await API.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Follow / Unfollow
export const followUser = async (userId) => {
  const response = await API.post(`/users/follow/${userId}`);
  return response.data;
};

// Search users
export const searchUsers = async (query) => {
  const response = await API.get(`/users/search?q=${query}`);
  return response.data;
};

// Suggested users
export const getSuggestedUsers = async () => {
  const response = await API.get("/users/suggested");
  return response.data;
};