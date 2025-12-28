import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Brain,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  // Password validation rules
  const passwordRequirements = useMemo(
    () => [
      { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
      { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
      { label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
      { label: "One number", test: (pw: string) => /[0-9]/.test(pw) },
      {
        label: "One special character (!@#$%^&*)",
        test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
      },
    ],
    []
  );

  const passwordValidation = useMemo(
    () =>
      passwordRequirements.map((req) => ({
        ...req,
        passed: req.test(password),
      })),
    [password, passwordRequirements]
  );

  const isPasswordValid = passwordValidation.every((req) => req.passed);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!isPasswordValid) {
      toast.error("Password is too weak", {
        description: "Please meet all password requirements",
      });
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match", {
        description: "Please re-enter your password",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ❌ Backend error (email already exists, etc.)
        toast.error(data.message || "Signup failed", {
          description: "Please try again with different details",
        });
        throw new Error(data.message || "Signup failed");
      }


      toast.success("Account created successfully!", {
        description: "Welcome to NeuroScan 🎉",
      });

      // Small delay so user can see toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error);

      // Optional fallback
      toast.error(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again."
      );
    }
  };

  const features = [
    "AI-powered brain tumor detection",
    "Instant results in under 60 seconds",
    "Secure and confidential analysis",
    "Access to scan history anytime",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 lg:order-1">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-primary">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              NeuroScan
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </h2>
            <p className="text-muted-foreground">
              Join thousands of healthcare professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-border/50 focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-2">
                  {passwordValidation.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        req.passed ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {req.passed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 h-12 border-border/50 focus:border-primary transition-colors ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? "border-destructive"
                      : ""
                  }`}
                  required
                />
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full group"
              disabled={!agreeTerms || !isPasswordValid || !passwordsMatch}
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-primary via-primary/90 to-primary/70 relative overflow-hidden order-1 lg:order-2">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="mb-8 animate-float">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Join NeuroScan
          </h1>
          <p className="text-xl text-white/80 text-center max-w-md mb-12">
            Start detecting brain tumors with cutting-edge AI technology today.
          </p>

          {/* Features List */}
          <div className="space-y-4 w-full max-w-sm">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Card */}
        <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-float animation-delay-1000">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-glow/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">AI Ready</div>
              <div className="text-white/60 text-xs">Advanced detection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
