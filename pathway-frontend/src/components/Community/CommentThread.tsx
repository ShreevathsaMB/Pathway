import { useState } from 'react';
import { User, CornerDownRight, Trash2 } from 'lucide-react';
import CommentInput from './CommentInput';
import axios from '../../api/axios';

interface CommentProps {
    comment: any;
    postId: string;
    postAuthorId: number;
    depth: number;
    onCommentAdded: () => void;
    currentUserId?: number;
}

function CommentItem({ comment, postId, postAuthorId, depth, onCommentAdded, currentUserId }: CommentProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const maxDepth = 5; // Maximum nesting depth
    const isOP = comment.is_op;
    const isAuthor = currentUserId === comment.author_id;

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const handleReplySubmit = () => {
        setShowReplyForm(false);
        onCommentAdded();
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this comment? This will also delete all replies.')) {
            return;
        }

        setDeleting(true);
        try {
            await axios.delete(`community/comments/${comment.id}/`);
            onCommentAdded(); // Refresh to show updated list
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    // Calculate indentation in pixels
    const indentPx = depth * 32; // 32px per level

    return (
        <div className="mb-3">
            {/* Comment Card with Border (only for depth > 0) */}
            <div
                className={`${depth > 0 ? 'border-l-2 border-purple-500/30 pl-3 md:pl-4' : ''} transition-all`}
                style={{ marginLeft: `${indentPx}px` }}
            >
                <div className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-sm hover:bg-white/10 transition-colors">
                    {/* Author Info */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-wrap">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-white/5">
                                <User className="w-3 h-3 text-purple-300" />
                            </div>
                            <span className="font-semibold text-sm text-white">
                                {comment.is_anonymous ? 'Anonymous' : comment.author_details?.username || 'User'}
                            </span>

                            {/* OP Badge */}
                            {isOP && (
                                <span className="px-2 py-0.5 bg-purple-600/80 text-white text-[10px] font-bold rounded shadow-[0_0_8px_rgba(147,51,234,0.5)]">
                                    OP
                                </span>
                            )}

                            <span className="text-xs text-slate-400">
                                {formatTimeAgo(comment.created_at)}
                            </span>
                        </div>

                        {/* Delete Button */}
                        {isAuthor && !deleting && (
                            <button
                                onClick={handleDelete}
                                className="text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded p-1 transition-colors"
                                title="Delete comment"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Comment Content */}
                    <p className="text-slate-300 text-sm mb-2 whitespace-pre-wrap break-words">{comment.content}</p>

                    {/* Reply Button */}
                    {depth < maxDepth && !deleting && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                        >
                            <CornerDownRight className="w-3 h-3" />
                            <span>{showReplyForm ? 'Cancel' : 'Reply'}</span>
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                    <div className="mt-3 animate-in fade-in duration-200">
                        <CommentInput
                            postId={postId}
                            parentCommentId={comment.id}
                            onSubmit={handleReplySubmit}
                            onCancel={() => setShowReplyForm(false)}
                        />
                    </div>
                )}
            </div>

            {/* Nested Replies - OUTSIDE the border container */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply: any) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            postAuthorId={postAuthorId}
                            depth={depth + 1}
                            onCommentAdded={onCommentAdded}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface CommentThreadProps {
    comments: any[];
    postId: string;
    postAuthorId: number;
    onCommentAdded: () => void;
    currentUserId?: number;
}

export default function CommentThread({ comments, postId, postAuthorId, onCommentAdded, currentUserId }: CommentThreadProps) {
    // Filter to show only top-level comments (no parent)
    const topLevelComments = comments?.filter(c => !c.parent_comment) || [];

    if (topLevelComments.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {topLevelComments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    postAuthorId={postAuthorId}
                    depth={0}
                    onCommentAdded={onCommentAdded}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
}
