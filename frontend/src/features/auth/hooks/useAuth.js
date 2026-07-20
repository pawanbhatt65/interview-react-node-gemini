import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useEffect } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (error) {
      console.log("userAuth.js > handleLogin catch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (error) {
      console.log("userAuth.js > handleRegister catch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.log("userAuth.js > handleLogout catch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        // console.log("data is: ", data.user)
        setUser(data.user);
      } catch (error) {
        console.log(
          "src > features > auth > hooks > useAuth.js getAndSetUser catch error: ",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    getAndSetUser();
  }, []);

  return { user, loading, handleLogin, handleRegister, handleLogout };
};
