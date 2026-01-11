import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { getYoutubeEmbedUrl } from "../lib/youtube";
import { ArrowLeft, BookOpen, User, PlayCircle, Loader2, Clock, Calendar, FileText, Download, MessageSquare } from "lucide-react";
import { DoubtSolver } from "../components/DoubtSolver";

export const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`);
                setCourse(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load course details");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl mb-4 backdrop-blur-sm">
                        {error || "Course not found"}
                    </div>
                    <button
                        onClick={() => navigate("/courses")}
                        className="glass-btn px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Blobs for Hero */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-blob -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 -z-10" />

                <div className="relative max-w-7xl mx-auto z-10">
                    <button
                        onClick={() => navigate("/courses")}
                        className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                    </button>

                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <BookOpen size={200} className="text-white" />
                        </div>

                        <div className="max-w-3xl relative z-10">
                            <div className="flex items-center gap-4 mb-6 text-sm font-medium">
                                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    Grade {course.grade}
                                </span>
                                <span className="flex items-center text-slate-300">
                                    <BookOpen className="w-4 h-4 mr-1.5 text-indigo-400" />
                                    {course.lessons?.length || 0} Lessons
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
                                {course.description || "No description provided."}
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                                        {course.educator?.name?.charAt(0) || "U"}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-white">{course.educator?.name || "Unknown Educator"}</p>
                                    <p className="text-xs text-indigo-300 uppercase tracking-wider">Course Instructor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Lessons */}
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                                <PlayCircle className="w-6 h-6 mr-3 text-indigo-400" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                                    Course Modules
                                </span>
                            </h2>

                            <div className="space-y-4">
                                {course.lessons?.length > 0 ? (
                                    course.lessons.map((lesson, idx) => {
                                        const embedUrl = getYoutubeEmbedUrl(lesson.youtubeUrl);
                                        return (
                                            <div key={lesson._id} className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
                                                <div className="flex items-start gap-5">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                                                            {lesson.title}
                                                        </h3>

                                                        {embedUrl ? (
                                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 shadow-2xl border border-white/10">
                                                                <iframe
                                                                    src={embedUrl}
                                                                    title={lesson.title}
                                                                    className="absolute inset-0 w-full h-full"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 bg-red-500/10 text-red-300 rounded-lg text-sm border border-red-500/20">
                                                                Video unavailable
                                                            </div>
                                                        )}

                                                        {lesson.description && (
                                                            <p className="mt-4 text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-white/10">
                                                                {lesson.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="glass-card p-12 text-center rounded-2xl">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                        <p className="text-slate-400">No lessons uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assignments */}
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                                <FileText className="w-6 h-6 mr-3 text-purple-400" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                                    Assignments & Resources
                                </span>
                            </h2>

                            <div className="space-y-4">
                                {course.assignments?.length > 0 ? (
                                    course.assignments.map((assignment, idx) => (
                                        <div key={idx} className="glass-card p-6 rounded-2xl hover:translate-x-1 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-white mb-1">
                                                        {assignment.title}
                                                    </h3>
                                                    {assignment.instructions && (
                                                        <p className="text-slate-400 text-sm line-clamp-2">
                                                            {assignment.instructions}
                                                        </p>
                                                    )}
                                                </div>
                                                <a
                                                    href={assignment.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="glass-btn-secondary p-3 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass-card p-8 text-center rounded-2xl">
                                        <p className="text-slate-500 text-sm">No assignments available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl sticky top-24">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400" /> Course Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5">
                                    <span className="text-slate-400">Lessons</span>
                                    <span className="text-white font-semibold">{course.lessons?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5">
                                    <span className="text-slate-400">Enrolled</span>
                                    <span className="text-white font-semibold">{course.studentsEnrolled || 0} Users Enrolled</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5">
                                    <span className="text-slate-400">Last Updated</span>
                                    <span className="text-white font-semibold">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
                                    <h4 className="font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Need Help?
                                    </h4>
                                    <p className="text-xs text-indigo-200/70 mb-4">
                                        Reach out to your educator for doubts.
                                    </p>
                                    <button
                                        onClick={() => alert(`Educator: ${course.educator?.name}\nEmail: ${course.educator?.email}`)}
                                        className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        Contact Educator
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Doubt Solver Component would go here - ensuring it inherits dark theme */}
                        <div className="glass-card p-6 rounded-2xl">
                            <DoubtSolver />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
