import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle2,
  Globe
} from "lucide-react";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [role, setRole] = useState("student");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    grade: "1st",
  });

  // Parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password, role });
      } else {
        await register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role,
          grade: role === "student" ? formData.grade : undefined,
        });
      }
      navigate(role === "educator" ? "/dashboard/teacher" : "/dashboard/user");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] overflow-hidden font-sans text-slate-200">

      {/* 1. VISUAL PANEL (Right Side on Desktop, Hidden on Mobile) */}
      <div className="hidden lg:flex w-7/12 relative overflow-hidden bg-indigo-950 items-center justify-center">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-[#030712] to-[#030712] z-0" />

        {/* Floating Elements (Parallax) */}
        <div
          className="absolute inset-0 z-10 transition-transform duration-200 ease-out"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 max-w-2xl px-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            The Future of Rural Education
          </div>

          <h1 className="text-6xl font-bold text-white tracking-tight leading-tight mb-8">
            Unlock your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              True Potential.
            </span>
          </h1>

          <div className="space-y-6">
            <FeatureRow icon={Globe} title="Access Anywhere" desc="Even on 2G networks in remote villages." />
            <FeatureRow icon={Zap} title="Adaptive Learning" desc="AI-powered curriculum that paces with you." />
            <FeatureRow icon={CheckCircle2} title="Certified Educators" desc="Learn from the nation's best teachers." />
          </div>

          {/* Decorative Code/Data Visual */}
          <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm font-mono text-xs text-indigo-200/70">
            <div className="flex gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <p>{`> connecting to rural_edu_network...`}</p>
            <p className="text-green-400">{`> connection established (latency: 12ms)`}</p>
            <p>{`> loading user_profile... done.`}</p>
          </div>
        </div>
      </div>


      {/* 2. FORM PANEL (Left Side, Full Width on Mobile) */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-6 sm:px-12 lg:px-20 relative z-30">

        {/* Mobile-only background hints */}
        <div className="lg:hidden absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 to-[#030712]" />

        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">RuralEdu</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-slate-400">
              {isLogin ? "Enter your credentials to continue." : "Start your journey in seconds."}
            </p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 mb-8">
            <RoleButton active={role === "student"} onClick={() => setRole("student")} label="User" />
            <RoleButton active={role === "educator"} onClick={() => setRole("educator")} label="Educator" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-4 animate-enter">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    placeholder="First Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  {/* Using the same name just for visual split example, usually we'd split the state too */}
                </div>
              </div>
            )}

            {!isLogin && role === "student" && (
              <div className="animate-enter">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map((g) => (
                    <option key={g} value={g} className="bg-slate-900">{g} Grade</option>
                  ))}
                </select>
              </div>
            )}

            <InputGroup
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputGroup
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-all"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

// Sub-components for cleaner code
// eslint-disable-next-line no-unused-vars
const FeatureRow = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default">
    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-white text-lg">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  </div>
);

const RoleButton = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${active ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
      }`}
  >
    {label}
  </button>
);

const InputGroup = ({ ...props }) => (
  <input
    {...props}
    className="w-full bg-transparent border-b border-slate-700/50 px-0 py-3 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all text-base"
  />
);