import { useRef, createContext, useEffect, useContext, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { useNavigate } from "react-router-dom";

const loginRequest = async (credentials) => {
  const { data } = await axios.post(
    "/authentication-service/login",
    credentials
  );
  return data;
};

const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext must be within AuthProvider");
  }

  return context;
};

const extractUser = (token) => {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace("-", "+").replace("_", "/");
  let parsedToken = JSON.parse(window.atob(base64));
  return parsedToken;
};

function AuthProvider(props) {
  const accessTokenRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    accessTokenRef.current = localStorage.getItem("token");

    if (accessTokenRef.current) {
      const user = extractUser(accessTokenRef.current);
      if (user) {
        const userRole = user.authorities;
        if (
          (userRole === "ROLE_CUSTOMER" &&
            !window.location.pathname.includes("/customer/")) ||
          (userRole === "ROLE_DISPATCHER" &&
            !window.location.pathname.includes("/dispatcher/")) ||
          (userRole === "ROLE_DELIVERER" &&
            !window.location.pathname.includes("/deliverer/"))
        ) {
          navigate("/*");
        }
      } else {
        navigate("/");
      }
    } else if (
      ![
        "/customer/login",
        "/dispatcher/login",
        "/deliverer/login",
        "/",
      ].includes(window.location.pathname)
    ) {
      navigate("/*");
      localStorage.clear();
    }

    axios.interceptors.request.use(
      (config) => {
        setIsLoading(true);
        config.baseURL =
          "http://" + import.meta.env.VITE_API_GATEWAY + ":10789/api";
        if (config.url !== "/authentication-service/login") {
          config.headers.authorization = `Bearer ${accessTokenRef.current}`;
        }
        //config.withCredentials = true;
        return config;
      },
      (error) => {
        setIsLoading(false);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        setIsLoading(false);
        return response;
      },
      async (error) => {
        setIsLoading(false);

        if (
          (error.config.url !== "/authentication-service/login" &&
            error.response?.status === 401) ||
          error.response?.status === 404
        ) {
          navigate("/*");
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const loginQuery = useMutation(loginRequest, {
    onSuccess: (data) => {
      accessTokenRef.current = data.token;
      localStorage.setItem("token", data.token);
      if (data.userRole === "DISPATCHER") {
        navigate("/dispatcher/dispatchers");
      } else if (data.userRole === "CUSTOMER") {
        navigate("/customer/active-deliveries");
      } else {
        navigate("/deliverer/boxes");
      }
    },
    onError: () => {
      showNotification({
        id: "error-notification-customer-login",
        autoClose: 5000,
        title: "Error",
        message: "User email or password is wrong.",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
    },
  });

  const login = async (credentials) => {
    await loginQuery.mutateAsync(credentials);
  };

  const isAuthenticated = localStorage.length !== 0;
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        login,
        axios,
      }}
      {...props}
    ></AuthContext.Provider>
  );
}

export default AuthProvider;
