import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import DashboardComp from "./components/DashboardComp/DashboardComp";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/protectedRoute";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import Emails from "./pages/Emails/Emails";
import DataSet from "./pages/DataSet/DataSet";
import Summaries from './pages/Summaries/Summaries'

export default function AppRoutes() {
  const routes = [
    { id: 1, href: "/", element: <Login /> },
    {
      id: 2,
      href: "/home",
      element: <Home />,
      dashboard: true,
      protected_app: true,
    },
    {
      id: 2,
      href: "/emails",
      element: <Emails />,
      dashboard: true,
      protected_google: true,
    },
    {
      id: 3,
      href: "/dataset",
      element: <DataSet />,
      dashboard: true,
      protected_app: true,
    },
    {
      id: 4,
      href: "/summaries",
      element: <Summaries />,
      dashboard: true,
      protected_app: true,
    },
    
    { id: 404, href: "*", element: <NotFound /> },
  ];

  return (
    <Routes>
      {routes.map((ele) =>
        ele.dashboard ? (
          ele.protected_app || ele.protected_google ? (
            <Route
              key={ele.id}
              path={ele.href}
              element={
                <ProtectedRoute
                  protected_google={ele.protected_google}
                  protected_app={ele.protected_app}
                >
                  <DashboardComp> {ele.element} </DashboardComp>{" "}
                </ProtectedRoute>
              }
            />
          ) : (
            <Route
              key={ele.id}
              path={ele.href}
              element={<DashboardComp> {ele.element} </DashboardComp>}
            />
          )
        ) : (
          <Route key={ele.id} path={ele.href} element={ele.element} />
        )
      )}
    </Routes>
  );
}
