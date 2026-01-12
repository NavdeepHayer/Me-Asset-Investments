import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { SetPassword } from "./pages/SetPassword";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthContext";

function Router() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // Check if we have auth tokens in the URL hash (from Supabase invite/recovery flow)
  // If we're on the homepage with auth tokens, redirect to /set-password
  if (path === '/' && hash) {
    const hashParams = new URLSearchParams(hash.substring(1));
    const type = hashParams.get('type');
    const hasAuthTokens = hashParams.get('access_token') || hashParams.get('error_code') || hashParams.get('error');

    // Redirect to set-password page if this is an invite, signup, or recovery flow
    if ((type === 'invite' || type === 'signup' || type === 'recovery') && hasAuthTokens) {
      window.location.href = `/set-password${hash}`;
      return null;
    }

    // Also handle error cases (expired invite links, etc.)
    if (hasAuthTokens) {
      window.location.href = `/set-password${hash}`;
      return null;
    }
  }

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
