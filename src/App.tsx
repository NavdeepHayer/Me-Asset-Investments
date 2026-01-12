import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { SetPassword } from "./pages/SetPassword";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthContext";

function Router() {
  const path = window.location.pathname;

  switch (path) {
    case '/admin':
      return <Admin />;
    case '/set-password':
      return <SetPassword />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
