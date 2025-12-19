import { createContext, useState, useContext, useEffect } from "react";
import { getRequest, postRequest, setAuthRef } from "../api/requests";
import { LOCAL_STORAGE_KEYS, loginRoute, remove_user_storage } from "../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user_google, set_user_google] = useState(null);
  const [user_app, set_user_app] = useState(null);

  const [loading, setLoading] = useState(false);

  const get_user = async () => {
    setLoading(true);
    try {
      const data = await getRequest({
        route: "auth/me",
        disableHandleError: true,
      });
      set_user_app(data.app_user);
      if (data.google_user && !data.google_user.error) {
        set_user_google(data.google_user);
      }
    } catch (ex) {
      set_user_app(null);
      set_user_google(null);
      console.error("Error geting user info: ", ex);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    set_user_google(null);
    set_user_app(null);

    try {
      remove_user_storage();

      await postRequest({
        route: "auth/logout",
        disableHandleError: true,
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    get_user();
    setAuthRef(logout);
  }, []);

  const login_with_google = () => {
    window.location.href = loginRoute;
  };

  const login_with_code = (code) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const login_result = await postRequest({
          route: "auth/login",
          body: {code},
        });

        if (login_result && login_result.code) {
          set_user_app({ code: login_result.code });
        }
        resolve(login_result);
      } catch (ex) {
        reject(ex);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user_app,
        user_google,
        get_user,

        login_with_code,
        login_with_google,

        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
