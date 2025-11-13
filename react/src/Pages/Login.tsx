import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
// Import axios and AxiosError for robust type checking
import axios from "axios";

// --- INTERFACES ---

interface LoginData {
    email: string;
    password: string;
    remember: boolean;
}

interface SignupData {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}

// Interface for the error structure returned by the API (external response payload)
// This strictly represents the object shape returned by the backend.
interface ApiErrorResponse {
    message?: string; // Often present on authentication errors or general failure
    errors?: Record<string, string[]>; // Often present on validation errors (field => array of messages)
}

// Interface for the internal component state used to store and render errors (flat map)
// This uses the index signature correctly to allow dynamic access via field names.
interface FormErrors {
    [key: string]: string[] | string | undefined;
    general?: string; // Explicitly includes 'general' for non-field-specific errors
}

// --- MAIN COMPONENT ---

export default function Login(): React.ReactElement {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    // Errors state is now typed to the FormErrors interface
    const [errors, setErrors] = useState<FormErrors>({});

    // Auth state management remains the same
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: "",
        remember: false,
    });

    const [signupData, setSignupData] = useState<SignupData>({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        terms: false,
    });

    // API base URL - adjust this to match your Laravel backend
    const API_URL = "http://localhost:8000/api";

    /** Handle Login Submission (Refactored to use Axios) */
    const handleLogin = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // 1. Use axios.post. Axios automatically serializes the body to JSON.
            const response = await axios.post(
                `${API_URL}/login`,
                {
                    email: loginData.email,
                    password: loginData.password,
                },
                {
                    // Axios uses 'headers' property for request configuration
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            // 2. Axios resolves successfully for 2xx status codes.
            const data = response.data;

            // NOTE: The current implementation uses localStorage.
            // For production-ready, multi-user apps, Firebase/Firestore is mandatory for persistent storage.
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Replaced alert with console.log as per constraints
            console.log("Login successful! Redirecting to dashboard.");
            window.location.href = "/dashboard";
        } catch (error: unknown) {
            // 3. Catch block handles non-2xx status codes (e.g., 401, 422, 500)
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data as ApiErrorResponse;

                // Check for validation errors (Laravel style: 'errors' object)
                if (errorData.errors) {
                    // Set field errors. We cast here as the shape is guaranteed to match FormErrors's index signature.
                    setErrors(errorData.errors as FormErrors);
                } else {
                    // Handle general/authentication errors (Laravel style: 'message')
                    setErrors({
                        general:
                            errorData.message ||
                            "Invalid credentials. Please try again.",
                    });
                }
            } else {
                // Handle network errors or unexpected exceptions
                console.error("Login error:", error);
                setErrors({
                    general:
                        "An unexpected error occurred. Please check your network connection.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /** Handle Signup Submission (Refactored to use Axios) */
    const handleSignup = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Client-side validation checks before making API call
        if (signupData.password !== signupData.password_confirmation) {
            setErrors({ password_confirmation: ["Passwords do not match"] });
            setLoading(false);
            return;
        }

        if (!signupData.terms) {
            setErrors({
                terms: ["You must agree to the terms and conditions"],
            });
            setLoading(false);
            return;
        }

        try {
            // 1. Use axios.post for registration
            await axios.post(
                `${API_URL}/signup`,
                {
                    name: signupData.name,
                    email: signupData.email,
                    phone: signupData.phone,
                    password: signupData.password,
                    password_confirmation: signupData.password_confirmation,
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            // 2. Success path
            console.log("Account created successfully!");
            setIsLogin(true); // Switch to login screen on successful registration

            // Clear the sign up form data
            setSignupData({
                name: "",
                email: "",
                phone: "",
                password: "",
                password_confirmation: "",
                terms: false,
            });
        } catch (error: unknown) {
            // 3. Error handling for Axios
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data as ApiErrorResponse;

                if (errorData.errors) {
                    setErrors(errorData.errors as FormErrors);
                } else {
                    setErrors({
                        general:
                            errorData.message ||
                            "Registration failed due to server error.",
                    });
                }
            } else {
                console.error("Signup error:", error);
                setErrors({
                    general:
                        "An unexpected error occurred. Please check your network connection.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /** Handle Input Changes (Login) */
    const handleLoginChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setLoginData({
            ...loginData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    /** Handle Input Changes (Signup) */
    const handleSignupChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setSignupData({
            ...signupData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    /** Render Validation Error */
    const renderError = (field: string) => {
        const message = errors[field];
        if (!message) return null;

        // Ensure message is handled correctly if it's an array or string
        const errorText = Array.isArray(message) ? message[0] : message;

        return <p className="text-red-500 text-xs mt-1">{errorText}</p>;
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 font-['Inter']"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
        >
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors rounded-tl-2xl ${
                                isLogin
                                    ? "text-purple-600 border-b-2 border-purple-600"
                                    : "text-gray-500 hover:text-purple-600"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors rounded-tr-2xl ${
                                !isLogin
                                    ? "text-purple-600 border-b-2 border-purple-600"
                                    : "text-gray-500 hover:text-purple-600"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    {isLogin && (
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome Back!
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Login to access your account
                            </p>

                            {errors.general && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="you@example.com"
                                    />
                                    {renderError("email")}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="••••••••"
                                    />
                                    {renderError("password")}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={loginData.remember}
                                            onChange={handleLoginChange}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </span>
                                    </label>
                                    <a
                                        href="#"
                                        className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className="text-purple-600 hover:text-purple-700 font-semibold"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SIGNUP FORM */}
                    {!isLogin && (
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Sign up to get started
                            </p>

                            {errors.general && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleSignup}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={signupData.name}
                                        onChange={handleSignupChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="John Doe"
                                    />
                                    {renderError("name")}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={signupData.email}
                                        onChange={handleSignupChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="you@example.com"
                                    />
                                    {renderError("email")}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={signupData.phone}
                                        onChange={handleSignupChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="+63 912 345 6789"
                                    />
                                    {renderError("phone")}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={signupData.password}
                                        onChange={handleSignupChange}
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="••••••••"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 8 characters
                                    </p>
                                    {renderError("password")}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={signupData.password_confirmation}
                                        onChange={handleSignupChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="••••••••"
                                    />
                                    {renderError("password_confirmation")}
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={signupData.terms}
                                            onChange={handleSignupChange}
                                            className="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            I agree to the{" "}
                                            <a
                                                href="#"
                                                className="text-purple-600 hover:text-purple-700 font-semibold"
                                            >
                                                Terms & Conditions
                                            </a>
                                        </span>
                                    </label>
                                    {renderError("terms")}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className="text-purple-600 hover:text-purple-700 font-semibold"
                                    >
                                        Login
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-white text-sm mt-6 opacity-90">
                    © 2025 Your E-Commerce Store. All rights reserved.
                </p>
            </div>
        </div>
    );
}
