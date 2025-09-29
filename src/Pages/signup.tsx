import { useRef, useState } from "react";
import { Button } from "../components/Ui/Button";
import axios from "axios";
import { BackendUrl } from "../config";
import { Link } from "react-router-dom";

export function SignUp() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    async function signup() {
        try {
            if (isLoading) return;
            setIsLoading(true);
            
            // Get form values
            const username = usernameRef.current?.value?.trim();
            const email = emailRef.current?.value?.trim();
            const password = passwordRef.current?.value?.trim();
            
            // Validate inputs
            if (!username || !email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            // Make API request
            const response = await axios.post(BackendUrl + "/signup", {
                username,
                email,
                password
            });
            
            // Check if signup was successful
            if (response.status === 200 && response.data.message) {
                alert("Signup successful! You can now sign in.");
                
                // Clear form
                if (usernameRef.current) usernameRef.current.value = "";
                if (emailRef.current) emailRef.current.value = "";
                if (passwordRef.current) passwordRef.current.value = "";
            } else {
                alert("Something went wrong. Please try again.");
            }
            
        } catch (error: any) {
            console.error("Signup error:", error);
            console.log("Full error response:", error.response);
            
            // Handle specific error cases
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 409) {
                    // Conflict error - user already exists
                    if (data.field === "email") {
                        alert("This email is already registered! Please use a different email address or sign in with your existing account.");
                    } else if (data.field === "username") {
                        alert("This username is already taken! Please choose a different username.");
                    } else {
                        alert("User already exists! Please try with different credentials.");
                    }
                } else if (status === 400) {
                    // Validation errors
                    alert("Invalid input data. Please check your entries and try again.");
                } else {
                    // Other server errors
                    alert(data.message || "Something went wrong. Please try again.");
                }
            } else if (error.request) {
                // Network error
                alert("Network error. Please check your internet connection and try again.");
            } else {
                // Other errors
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-[#020817] flex">
            {/* Left Panel - Welcome Content */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 relative overflow-hidden">
                
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
                    <div className="max-w-lg">
                        <h1 className="text-5xl xl:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                            MemoArcX
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            Your intelligent note-taking companion. Save, organize, and access your digital content from anywhere.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                    🧠
                                </div>
                                <span className="text-slate-200">Smart Notes → Save Tweets, Videos, Docs & Links in one place</span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    ⚡
                                </div>
                                <span className="text-slate-200">Quick Access → Organize and retrieve your notes instantly</span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    🔒
                                </div>
                                <span className="text-slate-200">Secure Cloud → Your data stays private and protected</span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    🌍
                                </div>
                                <span className="text-slate-200">Share & Collaborate → Connect with your team seamlessly</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Sign In Form */}
            <div className="w-full  flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-[#0f172a]  rounded-2xl p-8 shadow-2xl border border-white/20">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
                            <p className="text-slate-300">Sign up to start organizing your digital world with MemoArcX</p>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); signup(); }}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <input ref={usernameRef}
                                    type="text"
                                    id="username"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your username"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address (Gmail only)
                                </label>
                                <input ref={emailRef}
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="example@gmail.com"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input ref={passwordRef}
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex items-center">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    text={isLoading ? "Signing Up..." : "Sign Up"}
                                    type="submit"
                                />
                            </div>
                            
                            <div className="text-xs text-slate-400 mt-4">
                                <p>Requirements:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>Username: 3-10 characters</li>
                                    <li>Password: 6-20 characters</li>
                                    <li>Email: Must be a Gmail address</li>
                                </ul>
                            </div>

                        </form>

                        <p className="mt-8 text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}