import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
        ? "text-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/10"
        : "text-slate-300 hover:text-white hover:bg-white/5"
        }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_5px_#818cf8]" />
      )}
    </Link>
  );
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };






  return (
    <>
      <nav className="sticky top-4 z-50 w-[95%] max-w-7xl mx-auto rounded-2xl glass transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative p-2 rounded-lg overflow-hidden group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                <BookOpen size={20} className="relative z-10 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                RuralEdu
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/courses">Courses</NavLink>
              {user?.role === "educator" && <NavLink to="/dashboard/teacher">Educator Dashboard</NavLink>}
              {user?.role === "student" && <NavLink to="/dashboard/user">My Dashboard</NavLink>}
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                        <User size={16} className="text-indigo-400" />
                      </div>
                    </div>
                    <span className="hidden lg:block">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    title="Logout"
                  >
                    <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/"
                    className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/"
                    className="glass-btn px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl rounded-b-2xl overflow-hidden animate-enter">
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/courses"
                className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              {user?.role === "educator" && (
                <Link
                  to="/dashboard/teacher"
                  className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Educator Dashboard
                </Link>
              )}
              {user?.role === "student" && (
                <Link
                  to="/dashboard/user"
                  className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Dashboard
                </Link>
              )}

              <div className="border-t border-white/10 my-2 pt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm font-medium text-slate-500 mb-2">
                      Signed in as {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-white/5 font-medium flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid gap-3 p-2">
                    <Link
                      to="/"
                      className="glass-btn-secondary flex justify-center w-full px-4 py-3 rounded-lg font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/"
                      className="glass-btn flex justify-center w-full px-4 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/30"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

