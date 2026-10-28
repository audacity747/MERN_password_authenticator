import { useState, useEffect, useRef, useMemo, useContext, createContext } from "react";

const UserContext = createContext();

function Welcome() {
  const user = useContext(UserContext);
  return <h2>Welcome, {user}</h2>;
}

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    document.title = user ? "Welcome " + user : "Login";
  }, [user]);

  const strength = useMemo(() => {
    return password.length >= 6 ? "Good" : "Too short";
  }, [password]);

  async function send(path) {
    const res = await fetch("http://localhost:5000/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (path === "login" && res.ok) {
      setUser(data.email);
    } else {
      setMessage(data.message);
    }
  }

  if (user) {
    return (
      <UserContext.Provider value={user}>
        <Welcome />
      </UserContext.Provider>
    );
  }

  return (
    <div>
      <h2>Login / Register</h2>
      <input
        ref={emailRef}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p>Password: {strength}</p>
      <button onClick={() => send("register")}>Register</button>
      <button onClick={() => send("login")}>Login</button>
      <p>{message}</p>
    </div>
  );
}

export default App;