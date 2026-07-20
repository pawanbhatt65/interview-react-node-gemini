import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

//   console.log("user is: ", user, "children is: ", children);
  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
