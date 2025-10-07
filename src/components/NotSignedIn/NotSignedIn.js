import { useAuth } from "../../context/AuthContext";

import DashboardComp from "../DashboardComp/DashboardComp";
import Button from "../Button/Button";

export default function NotSignedIn({ google }) {
  const { login_with_google } = useAuth();

  return (
    <DashboardComp>
      <div>
        {google ? (
          <>
            <h3 className="subtitle">
              You have to sign in with google to access this page
            </h3>
            <Button onClick={login_with_google}> Login with google</Button>
          </>
        ) : (
          <>
            <h3> You have to sign in to access this page </h3>
          </>
        )}
      </div>
    </DashboardComp>
  );
}
