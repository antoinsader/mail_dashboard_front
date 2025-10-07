import { useAuth } from "../context/AuthContext";
import NotSignedIn from "./NotSignedIn/NotSignedIn";
import Dashboard from "./DashboardComp/DashboardComp";

export default function ProtectedRoute({
  protected_google,
  protected_app,
  children,
}) {
  const { loading, user_app, user_google } = useAuth();

  if (loading)
    return (
      <Dashboard>
        <div> Authenticating, please wait a moment...</div>
      </Dashboard>
    );
  if (protected_google && !user_google) return <NotSignedIn google />;
  if (protected_app && !user_app) return <NotSignedIn />;

  return <> {children} </>;
}
