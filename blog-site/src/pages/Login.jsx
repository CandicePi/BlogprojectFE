import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/users/login", { email, password });
      login(res.data); // save user in context + localStorage
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;AuthContext;