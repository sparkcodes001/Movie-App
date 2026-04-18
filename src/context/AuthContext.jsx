import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // note: SignUp
  function signUp({ name, email, password }) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = { name, email, password };

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exist" };
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setUser(newUser)

    return { success: true };
  }

  // note: LogIn
  function logIn({ email, password }) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!currentUser) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setUser(currentUser);

    return { success: true };
  }

  function logOut() {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
