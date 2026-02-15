// Get logged in user (normalized id)
export const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  // make sure whole app always uses "id"
  return {
    ...user,
    id: user._id || user.id,
  };
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Save login data
export const loginUser = (data) => {
  localStorage.setItem("token", data.token);

  // normalize id while saving
  const user = {
    ...data.user,
    id: data.user._id || data.user.id,
  };

  localStorage.setItem("user", JSON.stringify(user));
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
