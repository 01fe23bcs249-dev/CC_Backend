import { useState } from "react";
import { Send, Loader2, Bot, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const DoubtSolver = () => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setAnswer("");

        try {
            const { data } = await api.post("/ai/solve-doubt", { prompt: query });
            setAnswer(data.answer);
        } catch (err) {
            console.error(err);
            setError("Failed to get an answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/10">
            <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 px-6 py-4 flex items-center gap-3 relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute top-0 right-0 w-20 h-full bg-white/10 skew-x-12 blur-md" />

                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">AI Doubt Solver</h3>
                    <p className="text-indigo-100 text-xs">Powered by Gemini</p>
                </div>
            </div>

            <div className="p-6 bg-slate-900/30">
                <form onSubmit={handleAsk} className="mb-6">
                    <label htmlFor="doubt-input" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        Ask a question about this lesson
                    </label>
                    <div className="relative group">
                        <textarea
                            id="doubt-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., Explain the concept of gravity..."
                            className="glass-input w-full rounded-xl focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] text-sm p-4 pr-12 resize-none placeholder-slate-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl mb-4 backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {answer && (
                    <div className="glass-card rounded-xl p-5 border border-white/5 animate-enter">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Bot className="w-3 h-3" /> AI Answer
                        </h4>
                        <div className="text-sm text-slate-300 leading-relaxed space-y-2 [&>p]:mb-2 [&>h1]:text-white [&>h2]:text-white [&>h3]:text-white [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:rounded [&>code]:text-indigo-300">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {answer}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
