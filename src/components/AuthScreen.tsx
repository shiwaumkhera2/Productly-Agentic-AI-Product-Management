import React, { useState } from "react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Users, 
  Cpu, 
  Zap,
  CheckCircle,
  Play
} from "lucide-react";

interface UserSession {
  name: string;
  email: string;
  company: string;
  role: string;
  billingTier: string;
}

interface AuthScreenProps {
  onLogin: (user: UserSession) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup Form States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupRole, setSignupRole] = useState("Lead Product Manager");

  // General States
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Default credentials for testing
  const demoUser: UserSession = {
    name: "Guest Strategist",
    email: "demo@productly.io",
    company: "Acme Autonomous Corp",
    role: "Lead Product Manager",
    billingTier: "Enterprise Tier"
  };

  const handleDemoClick = () => {
    setError(null);
    setSuccessMsg("Welcome! Authenticating securely into Productly OS Demo Workspace...");
    setTimeout(() => {
      onLogin(demoUser);
    }, 900);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all email and password credentials.");
      return;
    }

    if (loginPassword.length < 5) {
      setError("Password must consist of at least 5 character tokens.");
      return;
    }

    // Retrieve simulated local user base database
    const usersStr = localStorage.getItem("productly_users");
    const usersList = usersStr ? JSON.parse(usersStr) : [];

    // Find custom registered user or default credentials
    const matchedUser = usersList.find((u: any) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword);

    if (matchedUser) {
      setSuccessMsg("Success! Validated secure signatures...");
      setTimeout(() => {
         onLogin({
           name: matchedUser.name,
           email: matchedUser.email,
           company: matchedUser.company,
           role: matchedUser.role,
           billingTier: "Pro Scale Plan"
         });
      }, 800);
    } else if (loginEmail.toLowerCase() === "demo@productly.io" && loginPassword === "password") {
       setSuccessMsg("Welcome back via Demo mode credentials!");
       setTimeout(() => {
         onLogin(demoUser);
       }, 800);
    } else {
       setError("Credentials match no active account record. Please try registering an account first, or use Demo Mode!");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signupName || !signupEmail || !signupPassword || !signupCompany) {
      setError("Please fill out all registration inputs to index your account.");
      return;
    }

    if (signupPassword.length < 5) {
      setError("For security compliance, choose a password of 5 or more characters.");
      return;
    }

    // Check email uniqueness in localStorage DB
    const usersStr = localStorage.getItem("productly_users");
    const usersList = usersStr ? JSON.parse(usersStr) : [];
    
    const emailExists = usersList.some((u: any) => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (emailExists || signupEmail.toLowerCase() === "demo@productly.io") {
      setError("This email token is already registered to another organization ledger.");
      return;
    }

    // Register user
    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      company: signupCompany,
      role: signupRole,
      createdAt: new Date().toISOString()
    };

    usersList.push(newUser);
    localStorage.setItem("productly_users", JSON.stringify(usersList));

    setSuccessMsg("Account successfully provisioned! Launching login pipeline...");
    
    // Auto login
    setTimeout(() => {
      onLogin({
        name: signupName,
        email: signupEmail,
        company: signupCompany,
        role: signupRole,
        billingTier: "Pro Growth Sandbox"
      });
    }, 1000);
  };

  return (
    <div id="auth_viewport" className="min-h-screen w-full bg-[#FCFCFD] text-[#222222] font-sans flex flex-col md:flex-row overflow-y-auto select-none">
      
      {/* Brand & Marketing panel (Left Column) */}
      <div className="w-full md:w-1/2 bg-[#FFF0F2] border-r border-[#FFD0D6] flex flex-col justify-between p-8 md:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Abstract Red/Rose Ambient Circles */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full bg-[#FF385C]/5 pointer-events-none blur-3xl"></div>
        <div className="absolute bottom-[-150px] left-[-150px] w-96 h-96 rounded-full bg-[#FF385C]/5 pointer-events-none blur-3xl"></div>

        {/* Header Branding */}
        <div className="flex items-center space-x-3.5 relative">
          <div className="w-10 h-10 rounded-xl bg-[#FF385C] flex items-center justify-center text-white font-bold text-xl shadow-md">
            P
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#222222] tracking-tight">Productly OS</h1>
            <span className="text-[9px] text-[#FF385C] font-mono tracking-widest font-bold block uppercase">Continuous Feedback Reasoning Engine</span>
          </div>
        </div>

        {/* Marketing Feature Focus */}
        <div className="my-12 md:my-auto max-w-lg space-y-8 relative">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white text-[#FF385C] border border-[#FFD0D6] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
              <span>Series A Pitch Accelerator</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#222222] tracking-tight leading-tight mt-4">
              Continuous Product Discovery on Autopilot
            </h2>
            <p className="text-[#484848] text-sm leading-relaxed mt-4">
              Accelerate switching costs, automate PRD composition, align roadmap values, and resolve support queue pain vectors with deep LLM multi-agent pipelines.
            </p>
          </div>

          {/* List of features */}
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-white/70 backdrop-blur-xs border border-[#FFF0F2] rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0F2] border border-[#FFD0D6] flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-[#FF385C]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#222222]">Episodic Organizational Recall</h4>
                <p className="text-[11px] text-[#484848]">Ingests raw Intercom, Zendesk, and Slack webhook feeds into dynamic vector embeddings automatically.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white/70 backdrop-blur-xs border border-[#FFF0F2] rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0F2] border border-[#FFD0D6] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-[#FF385C]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#222222]">Delay Prioritization Matrices</h4>
                <p className="text-[11px] text-[#484848]">Schedules sprints using Cost of Delay (CoD) algorithms backed by direct churn risk models.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-6 border-t border-[#FFD0D6] flex items-center justify-between text-xs text-[#717171] relative">
          <span>Enterprise Cloud Certified</span>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF385C]" />
            <span className="font-mono text-[9px] font-bold">SOC2 COMPLIANT SECURITY</span>
          </div>
        </div>
      </div>

      {/* Access Panel (Right Column) */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-12 lg:p-20 relative">
        
        {/* Try Demo Mode Hero Spot (Primary Call-to-action requested by user) */}
        <div className="mb-8 p-5 bg-[#FFF0F2] border border-[#FFD0D6] rounded-2xl relative shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-[#FF385C] fill-current animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-[#FF385C]">DEMO GATEWAY ACTIVE</span>
              </div>
              <h3 className="text-xs font-semibold text-[#222222]">Want to test Productly OS instantly?</h3>
              <p className="text-[11px] text-[#484848] leading-tight">Skip standard auth keys and explore our full AI workspace using our preloaded mock memory sandbox.</p>
            </div>
            
            <button 
              id="btn_try_demo_mode"
              onClick={handleDemoClick}
              className="px-4.5 py-2.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all transform active:scale-95 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Explore Demo</span>
            </button>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#222222]">
              {mode === "login" ? "Welcome Back" : "Compose Your Account"}
            </h2>
            <p className="text-xs text-[#717171] mt-1.5">
              {mode === "login" 
                ? "Gain access back to organizational metrics and autonomous workflows." 
                : "Register a secure startup space to begin synthesizing continuous discover charts."}
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-3.5 bg-[#FFF0F2] border border-[#FFD0D6] rounded-xl text-xs font-semibold text-[#FF385C] flex items-start gap-2 animate-pulse">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Active input fields depending on mode */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1.5">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    id="login_email"
                    required
                    type="email" 
                    placeholder="e.g. founder@mycompany.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-700 font-bold text-xs">Security Password</label>
                  <button 
                    type="button"
                    onClick={() => {
                      setLoginEmail("demo@productly.io");
                      setLoginPassword("password");
                      setError(null);
                    }}
                    className="text-[10px] text-[#FF385C] font-semibold hover:underline"
                  >
                    Load Default Demo Pass
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    id="login_password"
                    required
                    type="password" 
                    placeholder="Enter security token" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                id="btn_submit_login"
                type="submit"
                className="w-full py-3.5 bg-[#222222] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-all"
              >
                <span>Authorize Account</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-700 font-bold text-xs mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      id="signup_name"
                      required
                      type="text" 
                      placeholder="Your name" 
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-xs mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      id="signup_company"
                      required
                      type="text" 
                      placeholder="e.g. Stripe" 
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1.5">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    id="signup_email"
                    required
                    type="email" 
                    placeholder="founder@mycompany.com" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1.5">Your Strategic Team Role</label>
                <select 
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-gray-200 p-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-semibold cursor-pointer"
                >
                  <option value="Lead Product Manager">Lead Product Manager</option>
                  <option value="VP of Product Engineering">VP of Product Engineering</option>
                  <option value="Founder & CEO">Founder & CEO</option>
                  <option value="Support Operations Lead">Support Operations Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    id="signup_password"
                    required
                    type="password" 
                    placeholder="Create security password code" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs text-[#222222] focus:bg-white focus:border-[#FF385C] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                id="btn_submit_signup"
                type="submit"
                className="w-full py-3.5 bg-[#FF385C] hover:bg-[#E61E4D] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-all"
              >
                <span>Register Workspace Profile</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          )}

          {/* Toggle modes */}
          <div className="pt-4 border-t border-gray-150 text-center text-xs text-[#484848]">
            {mode === "login" ? (
              <span>
                Don't have a secure Productly OS slot?{" "}
                <button 
                  id="btn_toggle_to_signup"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="font-bold text-[#FF385C] hover:underline hover:text-[#E61E4D]"
                >
                  Signup Free
                </button>
              </span>
            ) : (
              <span>
                Already indexed an active profile?{" "}
                <button 
                  id="btn_toggle_to_login"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-bold text-[#FF385C] hover:underline hover:text-[#E61E4D]"
                >
                  Authorize Login
                </button>
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
