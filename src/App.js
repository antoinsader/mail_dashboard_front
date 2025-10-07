import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import { CacheProvider } from "./context/CacheContext";

function App() {
  return (
    <AuthProvider>
      <CacheProvider>
        <BrowserRouter>
          <Toaster />
          <AppRoutes />
        </BrowserRouter>
      </CacheProvider>
    </AuthProvider>
  );
}

export default App;
