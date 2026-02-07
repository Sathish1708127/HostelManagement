import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { register: registerFn, login: loginFn } = useAuth();

  const register = async () => {
    try {
      await registerFn(email, password);
      alert("Registered");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      await loginFn(email, password);
      alert("Logged in");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;

