import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type AuthEvent = 'invite' | 'recovery' | 'unknown';

export function SetPassword() {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [authEvent, setAuthEvent] = useState<AuthEvent>('unknown');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check for auth event from URL hash
    const checkAuthEvent = async () => {
      // Supabase puts tokens in the URL hash after redirect
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      // Check for error in URL (expired/invalid link)
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');

      if (errorCode || hashParams.get('error')) {
        const message = errorDescription
          ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
          : 'This link is invalid or has expired.';
        setError(message);
        setChecking(false);
        return;
      }

      if (type === 'invite' || type === 'signup') {
        setAuthEvent('invite');
      } else if (type === 'recovery') {
        setAuthEvent('recovery');
      }

      // If we have tokens, set the session
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setError('Invalid or expired link. Please request a new one.');
        }
      } else {
        // Check if user is already authenticated (came from email link)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Invalid or expired link. Please request a new one.');
        }
      }

      setChecking(false);
    };

    checkAuthEvent();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthEvent('recovery');
        setChecking(false);
      } else if (event === 'SIGNED_IN') {
        // User signed in via invite link
        if (authEvent === 'unknown') {
          setAuthEvent('invite');
        }
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [authEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate full name for invite flow
    if (authEvent === 'invite' && fullName.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Build update data - include full name for invite flow
      const updateData: { password: string; data?: { full_name: string } } = {
        password: password,
      };

      if (authEvent === 'invite' && fullName.trim()) {
        updateData.data = { full_name: fullName.trim() };
      }

      const { data: userData, error } = await supabase.auth.updateUser(updateData);

      if (error) {
        setError(error.message);
      } else {
        // If this is an invite flow, also update the profile with the full name
        if (authEvent === 'invite' && fullName.trim() && userData?.user?.id) {
          await supabase
            .from('profiles')
            .update({ full_name: fullName.trim() })
            .eq('id', userData.user.id);
        }

        setSuccess(true);
        // Redirect to home after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#2d382c] flex items-center justify-center">
        <div className="text-white/60">Verifying link...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#2d382c] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-600/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Password Set Successfully
          </h1>
          <p className="text-white/60 mb-6">
            Redirecting you to the homepage...
          </p>
        </div>
      </div>
    );
  }

  const title = authEvent === 'invite'
    ? 'Welcome! Set Your Password'
    : authEvent === 'recovery'
      ? 'Reset Your Password'
      : 'Set Your Password';

  const subtitle = authEvent === 'invite'
    ? 'Create a password to access your account'
    : 'Enter a new password for your account';

  return (
    <div className="min-h-screen bg-[#2d382c] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="text-3xl font-light text-white tracking-wide">
              ME<span className="text-white/40 mx-2">|</span>Asset Management
            </span>
          </a>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-white mb-2 text-center">
            {title}
          </h1>
          <p className="text-white/60 text-center mb-8">
            {subtitle}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <a
                href="/"
                className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
              >
                Return to Homepage
              </a>
            </div>
          )}

          {!error && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show full name field for invite flow only */}
            {authEvent === 'invite' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  autoFocus
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Enter new password"
                required
                minLength={6}
                autoFocus={authEvent !== 'invite'}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-[#2d382c] font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
          )}
        </div>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/50 hover:text-white/80 transition-colors text-sm">
            Back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
