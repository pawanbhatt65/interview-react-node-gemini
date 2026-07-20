import { Fragment } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate()
  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({email, password});
    navigate("/")
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <Fragment>
      <main>
        <div className="form-container">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                placeholder="Enter email address"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
              />
            </div>
            <button className="button primary-button">Login</button>
          </form>

          <p>
            Create an account? <Link to={"/register"}>Register</Link>
          </p>
        </div>
      </main>
    </Fragment>
  );
};

export default Login;
