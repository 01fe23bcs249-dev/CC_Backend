import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, School, BookOpen, Users, ArrowRight, PlayCircle, Star, Sparkles } from "lucide-react";

export const HomePage = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "educator" ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-indigo-300 font-medium text-sm mb-8 hover:bg-white/5 transition-colors cursor-default animate-enter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Revolutionizing Rural Education
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-enter">
              Quality Education <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-text">
                Without Barriers
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-enter animation-delay-2000">
              Connect with expert educators, access world-class resources, and bridge the gap between rural potential and global opportunity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-enter animation-delay-2000">
              {user ? (
                <Link
                  to={dashboardPath}
                  className="glass-btn px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 group"
                >
                  Go to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/"
                    className="glass-btn px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 group"
                  >
                    Start Learning Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/courses"
                    className="glass-btn-secondary px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 group"
                  >
                    <PlayCircle size={20} className="group-hover:scale-110 transition-transform" /> Browse Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} label="Active Users" value="10k+" delay="0" />
            <StatCard icon={School} label="Partner Schools" value="500+" delay="100" />
            <StatCard icon={BookOpen} label="Video Lessons" value="25k+" delay="200" />
            <StatCard icon={GraduationCap} label="Success Stories" value="98%" delay="300" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose RuralEdu?</h2>
            <p className="text-lg text-slate-400">
              We provide tools designed specifically to overcome the challenges of remote learning in rural areas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="Accessible Everywhere"
              description="Low-bandwidth optimized content ensures learning never stops, even with slow internet connections."
              delay="0"
            />
            <FeatureCard
              icon={Users}
              title="Expert Mentorship"
              description="Direct access to qualified educators who care about your growth and academic success."
              delay="200"
            />
            <FeatureCard
              icon={GraduationCap}
              title="Structured Path"
              description="Curriculum aligned with national standards to ensure you remain competitive."
              delay="400"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, delay }) => (
  <div
    className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
      <Icon size={28} />
    </div>
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
    </div>
  </div>
);

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div
    className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:translate-y-[-5px] transition-all duration-300"
  >
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={120} className="text-white" />
    </div>

    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
      <Icon size={28} className="text-white" />
    </div>

    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-lg">
      {description}
    </p>
  </div>
);
