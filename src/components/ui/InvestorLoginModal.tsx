import { useState, useCallback, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";

type View = "login" | "signup" | "forgot";
type Tab = "login" | "signup";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
}

interface InvestorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Validation helpers
const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
};

const validateFullName = (name: string): string | undefined => {
  if (!name) return "Full name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return undefined;
};

// Input field component - defined outside to prevent re-creation on every render
function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full bg-transparent border-b py-3 text-base md:text-lg text-white/90
          placeholder-white/30 focus:outline-none transition-colors duration-300
          disabled:opacity-40
          ${error ? "border-red-500/50 focus:border-red-500/70" : "border-white/20 focus:border-white/50"}
        `}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-xs tracking-wide"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InvestorLoginModal({ isOpen, onClose }: InvestorLoginModalProps) {
  const { showToast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // View state
  const [currentView, setCurrentView] = useState<View>("login");
  const [activeTab, setActiveTab] = useState<Tab>("login");

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");

  // Error states
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [signupErrors, setSignupErrors] = useState<FormErrors>({});
  const [forgotErrors, setForgotErrors] = useState<FormErrors>({});

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Measure content height only when view changes
  useEffect(() => {
    if (contentRef.current) {
      // Small delay to let the new view render before measuring
      const timeoutId = setTimeout(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.offsetHeight);
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [currentView, isOpen]);

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    setCurrentView("login");
    setActiveTab("login");
    setLoginEmail("");
    setLoginPassword("");
    setRememberMe(false);
    setSignupFullName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setForgotEmail("");
    setLoginErrors({});
    setSignupErrors({});
    setForgotErrors({});
    onClose();
  }, [onClose]);

  // Tab switching
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentView(tab);
  };

  // Login validation
  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {};
    const emailError = validateEmail(loginEmail);
    const passwordError = validatePassword(loginPassword);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Signup validation
  const validateSignupForm = (): boolean => {
    const errors: FormErrors = {};
    const nameError = validateFullName(signupFullName);
    const emailError = validateEmail(signupEmail);
    const passwordError = validatePassword(signupPassword);
    const confirmError = validateConfirmPassword(signupPassword, signupConfirmPassword);

    if (nameError) errors.fullName = nameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (confirmError) errors.confirmPassword = confirmError;

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Forgot password validation
  const validateForgotForm = (): boolean => {
    const errors: FormErrors = {};
    const emailError = validateEmail(forgotEmail);

    if (emailError) errors.email = emailError;

    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submissions
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    showToast("Successfully logged in", "success");
    handleClose();
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    showToast("Account created successfully", "success");
    handleClose();
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForgotForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    showToast("Password reset link sent to your email", "success");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-xl pointer-events-auto">
              {/* Animated border box */}
              <AnimatedBox contentHeight={contentHeight} />

              {/* Close button */}
              <motion.button
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 text-white/40 hover:text-white/70 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>

              {/* Content wrapper with animated height */}
              <motion.div
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #424f41 0%, #3A4539 50%, #2d382c 100%)' }}
                initial={{ height: 0 }}
                animate={{ height: contentHeight || "auto" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Inner content */}
                <div ref={contentRef} className="px-6 py-8 md:px-12 md:py-10">
                  {/* Header with animated lines */}
                  <motion.div
                    className="mb-8 md:mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <AnimatedHeader />
                  </motion.div>

                  {/* Tabs (only show when not on forgot password) */}
                  {currentView !== "forgot" && (
                    <motion.div
                      className="relative mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <div className="flex justify-center gap-8 md:gap-12">
                        <button
                          onClick={() => handleTabChange("login")}
                          className={`
                            pb-2 text-sm tracking-[0.2em] uppercase transition-colors duration-300
                            focus:outline-none focus:ring-0 border-none bg-transparent
                            ${activeTab === "login" ? "text-white" : "text-white/40 hover:text-white/60"}
                          `}
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => handleTabChange("signup")}
                          className={`
                            pb-2 text-sm tracking-[0.2em] uppercase transition-colors duration-300
                            focus:outline-none focus:ring-0 border-none bg-transparent
                            ${activeTab === "signup" ? "text-white" : "text-white/40 hover:text-white/60"}
                          `}
                        >
                          Sign Up
                        </button>
                      </div>

                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
                        <motion.div
                          className="h-full bg-white/50"
                          initial={false}
                          animate={{
                            left: activeTab === "login" ? "calc(50% - 80px)" : "calc(50% + 20px)",
                            width: activeTab === "login" ? "60px" : "70px",
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ position: "absolute" }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Back button for forgot password */}
                  {currentView === "forgot" && (
                    <motion.button
                      onClick={() => {
                        setCurrentView("login");
                        setForgotErrors({});
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 mb-6 text-white/40 hover:text-white/70 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                      <span className="text-sm tracking-wide">Back to Login</span>
                    </motion.button>
                  )}

                  {/* Divider line */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    <AnimatedDivider delay={0.7} />
                  </motion.div>

                  {/* Form views with height animation */}
                  <AnimatePresence mode="wait">
                    {currentView === "login" && (
                      <motion.form
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleLoginSubmit}
                        className="space-y-6"
                      >
                        <InputField
                          type="email"
                          value={loginEmail}
                          onChange={setLoginEmail}
                          placeholder="Email"
                          error={loginErrors.email}
                          disabled={isLoading}
                        />
                        <InputField
                          type="password"
                          value={loginPassword}
                          onChange={setLoginPassword}
                          placeholder="Password"
                          error={loginErrors.password}
                          disabled={isLoading}
                        />

                        {/* Remember me */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              disabled={isLoading}
                              className="sr-only"
                            />
                            <div
                              className={`
                                w-4 h-4 border transition-colors duration-300
                                ${rememberMe ? "border-white/50 bg-white/10" : "border-white/20"}
                                ${isLoading ? "opacity-40" : "group-hover:border-white/40"}
                              `}
                            >
                              {rememberMe && (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-full h-full text-white/70 p-0.5"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                            Remember me
                          </span>
                        </label>

                        {/* Submit button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white/90 border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner />
                                Logging in...
                              </span>
                            ) : (
                              "Log In"
                            )}
                          </button>
                        </div>

                        {/* Forgot password link */}
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => setCurrentView("forgot")}
                            className="text-sm text-white/40 hover:text-white/70 transition-colors tracking-wide"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {currentView === "signup" && (
                      <motion.form
                        key="signup"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSignupSubmit}
                        className="space-y-6"
                      >
                        <InputField
                          value={signupFullName}
                          onChange={setSignupFullName}
                          placeholder="Full Name"
                          error={signupErrors.fullName}
                          disabled={isLoading}
                        />
                        <InputField
                          type="email"
                          value={signupEmail}
                          onChange={setSignupEmail}
                          placeholder="Email"
                          error={signupErrors.email}
                          disabled={isLoading}
                        />
                        <InputField
                          type="password"
                          value={signupPassword}
                          onChange={setSignupPassword}
                          placeholder="Password"
                          error={signupErrors.password}
                          disabled={isLoading}
                        />
                        <InputField
                          type="password"
                          value={signupConfirmPassword}
                          onChange={setSignupConfirmPassword}
                          placeholder="Confirm Password"
                          error={signupErrors.confirmPassword}
                          disabled={isLoading}
                        />

                        {/* Submit button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white/90 border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner />
                                Creating account...
                              </span>
                            ) : (
                              "Create Account"
                            )}
                          </button>
                        </div>

                        {/* Login link */}
                        <div className="text-center pt-2">
                          <span className="text-sm text-white/40">
                            Already have an account?{" "}
                            <button
                              type="button"
                              onClick={() => handleTabChange("login")}
                              className="text-white/60 hover:text-white/90 transition-colors"
                            >
                              Log in
                            </button>
                          </span>
                        </div>
                      </motion.form>
                    )}

                    {currentView === "forgot" && (
                      <motion.form
                        key="forgot"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleForgotSubmit}
                        className="space-y-6"
                      >
                        <p className="text-white/50 text-sm leading-relaxed text-center mb-6">
                          Enter your email and we'll send you a link to reset your password.
                        </p>

                        <InputField
                          type="email"
                          value={forgotEmail}
                          onChange={setForgotEmail}
                          placeholder="Email"
                          error={forgotErrors.email}
                          disabled={isLoading}
                        />

                        {/* Submit button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white/90 border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner />
                                Sending...
                              </span>
                            ) : (
                              "Send Reset Link"
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Bottom line */}
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    <AnimatedDivider delay={0.8} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Animated box that draws from top center, splits, and meets at bottom
function AnimatedBox({ contentHeight }: { contentHeight: number }) {
  const [dimensions, setDimensions] = useState({ width: 576, height: 500 }); // Default max-w-xl
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: contentHeight || rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [contentHeight]);

  const { width, height } = dimensions;
  const strokeWidth = 2;

  // Don't render if dimensions aren't set yet
  if (width === 0 || height === 0) return <div ref={containerRef} className="absolute inset-0" />;

  // Path from top center, split left and right, down sides, meet at bottom center
  const leftPath = `M ${width / 2} 0 L 0 0 L 0 ${height} L ${width / 2} ${height}`;
  const rightPath = `M ${width / 2} 0 L ${width} 0 L ${width} ${height} L ${width / 2} ${height}`;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="glow-box" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left side path */}
        <motion.path
          d={leftPath}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-box)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Right side path */}
        <motion.path
          d={rightPath}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-box)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// Animated header with "ME | Investor Login" and decorative lines
function AnimatedHeader() {
  return (
    <div className="relative flex items-center justify-center">
      {/* SVG lines with glow effect */}
      <svg
        className="absolute inset-0 w-full h-14 overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-modal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left line */}
        <motion.line
          x1="0%"
          y1="50%"
          x2="25%"
          y2="50%"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow-modal)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />

        {/* Right line */}
        <motion.line
          x1="75%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow-modal)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
      </svg>

      {/* Text - matching site branding style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative flex items-baseline gap-2 md:gap-3"
      >
        <span
          className="text-2xl md:text-3xl font-semibold text-white tracking-wide"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ME
        </span>
        <span className="text-xl md:text-2xl text-white/40 font-light">|</span>
        <span className="text-sm md:text-lg tracking-[0.12em] md:tracking-[0.15em] uppercase text-white/70 font-medium">
          Investor Login
        </span>
      </motion.div>
    </div>
  );
}

// Animated divider line
function AnimatedDivider({ delay = 0.2 }: { delay?: number }) {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      />
    </div>
  );
}

// Loading spinner
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
