import { Home } from "./pages/Home";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Home />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
