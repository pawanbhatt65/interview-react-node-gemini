import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(
      "src > features > auth > services > auth.api.js register catch error: ",
      error,
    );
  }
}

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(
      "src > features > auth > services > auth.api.js login catch error: ",
      error,
    );
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.log(
      "src > features > auth > services > auth.api.js logout catch error: ",
      error,
    );
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (error) {
    console.log(
      "src > features > auth > services > auth.api.js getMe catch error: ",
      error,
    );
  }
};
