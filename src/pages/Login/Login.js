import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import TextInput from "../../components/Inputs/TextInput";

import "./Login.scss";
import toast from "react-hot-toast";
import { useCachedState } from "../../context/CacheContext";
import { LOCAL_STORAGE_KEYS } from "../../config";

export default function Login() {
  const { user_app, user_google, login_with_code, login_with_google, loading } =
    useAuth();

  const [user_code, set_user_code] = useCachedState(
    LOCAL_STORAGE_KEYS.last_code,
    ""
  );
  const [show_user_code_input, set_show_user_code_input] = useState(false);

  const [login_error, set_login_error] = useState();

  const login_normal = async () => {
    if (loading) return;
    set_login_error();
    try {
      await login_with_code(user_code);
    } catch (ex) {
      toast.error(ex.msg || ex);
      set_login_error(ex.msg || ex);
      console.error("Error login with code : ", ex);
    }
  };

  if (user_google) return <Navigate to="/home" replace />;

  return (
    <div className="login_page_root">
      <div className="login_card">
        <h1 className="title"> Welcome back </h1>

        <p> You can login with GMAIL to process your emails </p>
        <Button btnClass="login_btn" onClick={login_with_google}>
          <span> Login with google </span>
        </Button>

        {user_app ? (
          <p className="subtitle"> You are logged in with code </p>
        ) : !show_user_code_input ? (
          <>
            <p className="subtitle">
              Or you can login with your old code to process your pre-saved
              datasets
            </p>
            <Button
              btnClass="login_btn"
              onClick={() => set_show_user_code_input(true)}
            >
              Login with code
            </Button>
          </>
        ) : (
          <>
            <TextInput
              label="Code"
              value={user_code}
              onChange={set_user_code}
            />

            <Button
              btnClass="login_btn"
              onClick={login_normal}
              loading={loading}
            >
              <span> Login </span>
            </Button>
          </>
        )}

        {login_error && <p className="error"> {login_error}</p>}
      </div>
    </div>
  );
}
