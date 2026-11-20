import { useState } from 'react';
import axios from '../../api/axios';
import { Send } from 'lucide-react';

interface CommentInputProps {
    postId: string;
    parentCommentId?: string | null;
    onSubmit: () => void;
    onCancel?: () => void;
}

export default function CommentInput({ postId, parentCommentId, onSubmit, onCancel }: CommentInputProps) {
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await axios.post('community/comments/', {
                post: postId,
                parent_comment: parentCommentId || null,
                content: content.trim(),
                is_anonymous: isAnonymous
            });

            setContent('');
            setIsAnonymous(false);
            onSubmit();
        } catch (error) {
            console.error('Failed to post comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-black/20 rounded-xl p-4 mb-4 border border-white/5 shadow-inner">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentCommentId ? "Write a reply..." : "Add a comment..."}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-slate-400 transition-all font-sans"
                rows={parentCommentId ? 2 : 3}
                disabled={loading}
            />

            <div className="flex items-center justify-between mt-3">
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-purple-600 focus:ring-purple-500/50 checked:border-purple-500 transition-colors cursor-pointer"
                        disabled={loading}
                    />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Post anonymously</span>
                </label>

                <div className="space-x-3 flex items-center">
                    {parentCommentId && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="px-5 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all shadow-[0_4px_15px_rgba(124,58,237,0.3)] flex items-center gap-2"
                    >
                        {loading ? 'Posting...' : parentCommentId ? 'Reply' : 'Comment'}
                        {!loading && <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </form>
    );
}
