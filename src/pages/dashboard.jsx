import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiMultipart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { BookOpen, User, Users, Video, FileText, Plus, Upload, Loader2, PlayCircle } from "lucide-react";

const Loading = () => (
  <div className="flex justify-center p-20">
    <Loader2 className="animate-spin text-indigo-400 w-10 h-10" />
  </div>
);

const ErrorMsg = ({ message }) => (
  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg backdrop-blur-md">
    {message}
  </div>
);

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/dashboard/student");
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter">
      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">My Courses</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {data.myCourses?.length || 0} enrolled
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.myCourses?.map((course) => (
            <div key={course._id} className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500 border border-slate-700 px-2 py-1 rounded-full">
                  {course.grade} Grade
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{course.description || "No description provided."}</p>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <User size={14} />
                <span>{course.educator?.name || "N/A"}</span>
              </div>

              {course.lessons?.length > 0 ? (
                <button
                  className="w-full glass-btn py-2.5 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 group-hover:shadow-indigo-500/25 transition-all"
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <PlayCircle size={16} /> Continue Learning
                </button>
              ) : (
                <div className="w-full py-2.5 text-center text-sm text-slate-500 bg-white/5 rounded-xl border border-white/5">
                  No lessons yet
                </div>
              )}
            </div>
          ))}
          {data.myCourses?.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white/5 rounded-2xl border border-dashed border-slate-700">
              <p>You haven't enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">Available Educators</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {data.educators?.length || 0} educators
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.educators?.map((ed) => (
            <div key={ed._id} className="glass-card p-6 rounded-2xl hover:translate-y-[-2px] transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    {ed.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{ed.name}</h3>
                  <p className="text-slate-400 text-sm">{ed.email}</p>
                </div>
              </div>
              <button className="w-full glass-btn-secondary py-2 rounded-lg text-sm font-medium">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EducatorDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", grade: "1st" });
  const [lessonForm, setLessonForm] = useState({ courseId: "", title: "", youtubeUrl: "" });
  const [assignmentForm, setAssignmentForm] = useState({ courseId: "", title: "", instructions: "", pdf: null });

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/dashboard/educator");
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCourseCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/courses/create", form);
      setForm({ title: "", description: "", grade: "1st" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleLessonAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/courses/${lessonForm.courseId}/lessons`, {
        title: lessonForm.title,
        youtubeUrl: lessonForm.youtubeUrl,
      });
      setLessonForm({ courseId: "", title: "", youtubeUrl: "" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add lesson");
    }
  };

  const handleAssignmentAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", assignmentForm.title);
      formData.append("instructions", assignmentForm.instructions);
      if (assignmentForm.pdf) formData.append("pdf", assignmentForm.pdf);

      await apiMultipart.post(`/courses/${assignmentForm.courseId}/assignments`, formData);
      setAssignmentForm({ courseId: "", title: "", instructions: "", pdf: null });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload assignment");
    }
  };

  const InputClass = "glass-input block w-full rounded-lg text-sm p-3 placeholder-slate-500 focus:placeholder-slate-400";
  const SelectClass = "glass-input block w-full rounded-lg text-sm p-3 bg-[#1e293b]"; // Solid bg for options readability
  const ButtonClass = "glass-btn w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all";

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 font-medium mb-1">Total Courses</h3>
            <p className="text-4xl font-bold text-white">{data.totalCourses}</p>
          </div>
          <BookOpen className="absolute bottom-4 right-4 text-white/5 w-24 h-24" />
        </div>
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 font-medium mb-1">Active Users</h3>
            <p className="text-4xl font-bold text-white">--</p>
          </div>
          <Users className="absolute bottom-4 right-4 text-white/5 w-24 h-24" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {/* Create Course */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Plus size={20} /></div>
            <h2 className="text-xl font-bold text-white">Create Course</h2>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleCourseCreate}>
            <input
              required
              placeholder="Course title"
              className={InputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className={InputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              required
              className={SelectClass}
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            >
              {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map((g) => (
                <option key={g} value={g} className="bg-slate-900">{g} grade</option>
              ))}
            </select>
            <button type="submit" className={ButtonClass}>Create Course</button>
          </form>
        </div>

        {/* Add Lesson */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Video size={20} /></div>
            <h2 className="text-xl font-bold text-white">Add Video Lesson</h2>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleLessonAdd}>
            <select
              required
              className={SelectClass}
              value={lessonForm.courseId}
              onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value })}
            >
              <option value="" className="bg-slate-900">Select course</option>
              {data.courses?.map((c) => (
                <option key={c._id} value={c._id} className="bg-slate-900">{c.title}</option>
              ))}
            </select>
            <input
              required
              placeholder="Lesson title"
              className={InputClass}
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            />
            <input
              required
              placeholder="YouTube URL"
              className={InputClass}
              value={lessonForm.youtubeUrl}
              onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
            />
            <button type="submit" className={ButtonClass}>Add Lesson</button>
          </form>
        </div>

        {/* Upload Assignment */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Upload size={20} /></div>
            <h2 className="text-xl font-bold text-white">Upload Assignment</h2>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleAssignmentAdd}>
            <select
              required
              className={SelectClass}
              value={assignmentForm.courseId}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, courseId: e.target.value })}
            >
              <option value="" className="bg-slate-900">Select course</option>
              {data.courses?.map((c) => (
                <option key={c._id} value={c._id} className="bg-slate-900">{c.title}</option>
              ))}
            </select>
            <input
              required
              placeholder="Assignment title"
              className={InputClass}
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
            />
            <textarea
              placeholder="Instructions"
              className={InputClass}
              rows={2}
              value={assignmentForm.instructions}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
            />
            <input
              type="file"
              accept="application/pdf"
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
              onChange={(e) => setAssignmentForm({ ...assignmentForm, pdf: e.target.files?.[0] || null })}
            />
            <button type="submit" className={ButtonClass}>Upload PDF</button>
          </form>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses?.map((course) => (
            <div key={course._id} className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all">
              <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300">{course.grade} Grade</span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300">{course.studentsEnrolled || 0} Students</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description || "No description"}</p>
            </div>
          ))}
          {data.courses?.length === 0 && <p className="text-slate-500">No courses created yet.</p>}
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      <Navbar />
      {user.role === "student" ? <UserDashboard /> : <EducatorDashboard />}
    </>
  );
};
