import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(!!token);
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  const storeTokenInLs = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const LogoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setToken("");
    localStorage.removeItem("token");
    setCartCount(0);
    setWishCount(0);
  };

  const userAuthentication = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const updateCartCount = async () => {
    const guestId = localStorage.getItem("guestId");

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!token && guestId && { "x-guest-id": guestId }),
    };

    try {
      const res = await fetch("http://localhost:5000/api/cart", { headers });
      const data = await res.json();

      if (data.totalQuantity !== undefined) {
        setCartCount(data.totalQuantity);
      } else if (Array.isArray(data.cartItems)) {
        const count = data.cartItems.reduce(
          (total, item) => total + (item.quantity || 1),
          0
        );
        setCartCount(count);
        console.log("Cart count updated to:", count);

      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  const updateWishCount = async () => {
    if (!token) {
      setWishCount(0);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/wishes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishCount(data.length || 0);
    } catch (err) {
      console.error("Failed to fetch wish count", err);
      setWishCount(0);
    }
  };

  useEffect(() => {
    setIsLoggedin(!!token);
    if (token) {
      userAuthentication();
    }

    updateCartCount();
    updateWishCount();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        storeTokenInLs,
        LogoutUser,
        isLoggedin,
        user,
        setUser,
        cartCount,
        wishCount,
        updateCartCount,
        updateWishCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return authContextValue;
};
