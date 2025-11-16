'use client'

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Mail, Lock, User, ArrowRight, Eye, EyeOff, Building, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const searchParams = useSearchParams();

  const callbackUrl = "/dashboard";

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Show toasts for NextAuth error codes that may appear on redirect
  useEffect(() => {
    const err = searchParams.get('error');
    if (!err) return;

    switch (err) {
      case 'AccessDenied':
      case 'AccountDisabled':
        toast.error('Your account has been deactivated.', {
          description: 'Please contact support to reactivate your account.',
        });
        setError('Your account has been deactivated.');
        break;
      case 'OAuthAccountNotLinked':
        toast.error('Account not linked', {
          description: 'Sign in with the originally used provider or link accounts.',
        });
        setError('Account not linked. Please use the original provider.');
        break;
      case 'Configuration':
        toast.error('Authentication configuration error');
        setError('Authentication configuration error. Please try again later.');
        break;
      case 'CredentialsSignin':
        toast.error('Invalid email or password');
        setError('Invalid email or password. Please try again.');
        break;
      default:
        toast.error('Sign-up failed', { description: err });
        setError('Sign-up failed. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.company,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error || "Registration failed. Please try again.";
        toast.error(msg);
        setError(msg);
        setIsLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'AccessDenied') {
          toast.error('Your account has been deactivated.', {
            description: 'Please contact support to reactivate your account.',
          });
          setError('Your account has been deactivated.');
        } else if (result.error === 'CredentialsSignin') {
          toast.error('Invalid email or password');
          setError('Invalid email or password. Please try again.');
        } else {
          toast.error('Sign-in failed', { description: result.error });
          setError('Sign-in failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
    } catch (error: any) {
      console.error("Sign up error:", error);
      const message = error?.message?.includes('deactivated')
        ? 'Your account has been deactivated.'
        : 'An error occurred. Please try again.';
      toast.error(message);
      setError(message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: true,
      });

      if (result?.error) {
        setError("Failed to sign up with Google. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/moha-logo.svg"
              alt="Moha Insurance"
              width={180}
              height={60}
              className="h-16 w-auto"
            />
          </motion.div>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Get started with your dashboard access
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 relative hover:bg-gray-50 hover:border-gray-300 transition-all"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-2 text-gray-700" />
              {isLoading ? "Signing up..." : "Continue with Google"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700">
                  <Building className="w-4 h-4" />
                  Company Name
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company Ltd."
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be 8+ characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                href="/dashboard/auth/sign-in" 
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-gray-700 hover:text-gray-900 underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gray-700 hover:text-gray-900 underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
