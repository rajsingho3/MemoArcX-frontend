import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "../components/Ui/Button";
import { BackendUrl } from "../config";
import { useNavigate } from "react-router-dom";


export function SignIn() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    async function signin() {
        try {
            if (isLoading) return;
            
            // Get form values
            
            const email = emailRef.current?.value?.trim();
            const password = passwordRef.current?.value?.trim();
            
            // Validate inputs
            if ( !email || !password) {
                alert("Please fill in all fields");
                return;
            }
            setIsLoading(true);
            
            // Make API request
            const response = await axios.post(BackendUrl + "/signin", {
                email,
                password
            });
            

            
            // Check if signup was successful
            if (response.status === 200 && response.data.token) {
                // Save token for authenticated requests
                localStorage.setItem("token", response.data.token);
                // Configure axios to send Bearer token from now on
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
                // Persist the email for welcome message and other UI uses
                if (email) {
                    localStorage.setItem("email", email);
                }
                // Notify app about auth change so routing reacts immediately
                window.dispatchEvent(new Event('auth-changed'));
                navigate('/');
                
                // Clear form
               
                if (emailRef.current) emailRef.current.value = "";
                if (passwordRef.current) passwordRef.current.value = "";
            } else {
                alert("Something went wrong. Please try again.");
            }
            
        } catch (error: any) {
            console.error("Signin error:", error);
            console.log("Full error response:", error.response);
            
            // Handle specific error cases
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    // User not found or validation error
                    alert(data?.message || "Invalid request. Please check your inputs.");
                } else if (status === 403) {
                    alert("Invalid email or password");
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
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-slate-300">Sign in to your MemoArcX account</p>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); signin(); }}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    ref={emailRef}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    ref={passwordRef}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center text-sm text-slate-300">
                                    <input type="checkbox" className="mr-2 rounded border-slate-600 bg-white/10" />
                                    Remember me
                                </label>
                                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                variant="secondary"
                                size="lg"
                                text={isLoading ? "Signing In..." : "Sign In"}
                                type="submit"
                            />


                        </form>

                        <p className="mt-8 text-center text-sm text-slate-400">
                            Don't have an account?{' '}
                            <a href="./signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}