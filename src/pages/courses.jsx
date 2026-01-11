import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { BookOpen, User, Loader2, Search, ArrowRight, PlayCircle } from "lucide-react";

export const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [educators, setEducators] = useState([]);
  const [enrolling, setEnrolling] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "student") {
          const { data } = await api.get("/enrollments/my-courses");
          setEnrolledIds(new Set(data.map(e => e.course._id)));
        }

        if (user?.role === "student" && user?.grade) {
          const { data } = await api.get(`/courses?grade=${encodeURIComponent(user.grade)}`);
          setCourses(data);
        } else {
          const { data } = await api.get("/courses");
          setCourses(data);
        }

        const { data: eds } = await api.get("/courses/educators");
        setEducators(eds);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const enroll = async (courseId) => {
    setError("");
    setMessage("");
    setEnrolling(courseId);
    try {
      const { data } = await api.post(`/enrollments/enroll/${courseId}`);
      setMessage(data.message || "Enrolled");
      setEnrolledIds(prev => new Set(prev).add(courseId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling("");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-enter">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            Discover Knowledge
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {user?.role === "student" && user.grade
              ? `Curriculum for ${user.grade} Grade`
              : "Explore All Courses"}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Access high-quality educational content designed to empower your learning journey.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl backdrop-blur-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-xl backdrop-blur-sm">
            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {courses.map((course) => (
            <div
              key={course._id}
              className="glass-card rounded-2xl overflow-hidden hover:translate-y-[-5px] transition-all duration-300 flex flex-col group"
            >
              <div className="p-6 flex-1 relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BookOpen size={100} className="text-white" />
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {course.grade} Grade
                  </span>
                  {course.educator && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {course.educator.name.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-400">{course.educator.name}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {course.description || "No description provided for this course."}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-indigo-400" />
                    {course.studentsEnrolled} Users
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5 mt-auto">
                {user?.role === "student" && (
                  <button
                    onClick={() => enroll(course._id)}
                    disabled={enrolling === course._id || enrolledIds.has(course._id)}
                    className={`w-full glass-btn py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${enrolledIds.has(course._id)
                      ? "opacity-50 cursor-default hover:transform-none hover:shadow-none bg-emerald-600/20 text-emerald-300 border-emerald-500/30"
                      : "hover:shadow-indigo-500/20"
                      }`}
                  >
                    {enrolling === course._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enrolling...
                      </>
                    ) : enrolledIds.has(course._id) ? (
                      "Enrolled"
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                )}

                {course.lessons?.length > 0 && (
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="w-full mt-2 glass-btn-secondary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group-hover:bg-white/10 transition-colors"
                  >
                    <PlayCircle size={16} /> View Content
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="glass-card p-12 text-center rounded-2xl border-dashed border-slate-700">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-medium text-white">No courses available</h3>
            <p className="text-slate-400">Check back later for new content.</p>
          </div>
        )}

        {/* Educators Section */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <User size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Top Educators</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {educators.map((ed) => (
              <div key={ed._id} className="glass-card p-5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    {ed.name.charAt(0)}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{ed.name}</p>
                  <p className="text-xs text-slate-400 truncate">{ed.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
