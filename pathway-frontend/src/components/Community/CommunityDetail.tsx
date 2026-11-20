import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { MessageSquare, ThumbsUp, User, Clock, ChevronDown, ChevronUp, Trash2, Shield, Users, ArrowLeft } from 'lucide-react';
import CommentThread from './CommentThread';
import CommentInput from './CommentInput';

export default function CommunityDetail() {
    const { id } = useParams();
    const [community, setCommunity] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('users/profile/');
            setCurrentUserId(response.data.id);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const fetchData = async () => {
        try {
            const commResponse = await axios.get('community/list/');
            const comms = commResponse.data.results || commResponse.data;
            const currentComm = comms.find((c: any) => c.slug === id);
            setCommunity(currentComm);
            fetchPosts();
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setLoading(false);
        }
    };

    const fetchPosts = async () => {
         try {
            const response = await axios.get(`community/posts/?community_slug=${id}`);
            const data = response.data.results || response.data;
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpvote = async (postId: number) => {
        try {
            await axios.post(`community/posts/${postId}/upvote/`);
            fetchPosts();
        } catch (error) {
            console.error('Failed to upvote:', error);
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this post? This will also delete all comments.')) {
            return;
        }
        try {
            await axios.delete(`community/posts/${postId}/`);
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="hg-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, border: '4px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    return (
        <div className="hg-root page-container" style={{ minHeight: '100%', position: 'relative' }}>
            {/* Background Orbs */}
            <div className="hg-orb hg-orb-1" style={{ top: '10%', left: '80%' }} />
            <div className="hg-orb hg-orb-2" style={{ top: '70%', left: '10%' }} />

            {/* Header / Nav */}
            <div className="relative z-10 w-full max-w-7xl mx-auto mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Communities
                </button>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ── LEFT SIDEBAR ── */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div className="text-4xl mb-4 w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                            {community?.icon || '💬'}
                        </div>
                        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{community?.name || 'Community'}</h1>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {community?.description || 'A safe space to discuss and share your experiences.'}
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><Users className="w-4 h-4 text-purple-400" /> Members</span>
                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{community?.active_members || 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><MessageSquare className="w-4 h-4 text-pink-400" /> Posts</span>
                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{community?.post_count || 0}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/create')}
                            className="w-full text-white py-3 rounded-xl font-bold transition-all duration-300"
                            style={{ background: 'linear-gradient(to right, #7c3aed, #db2777)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}
                        >
                            + Create Post
                        </button>
                    </div>

                    <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Shield className="w-5 h-5 text-indigo-400" /> Community Rules
                        </h3>
                        <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <li className="flex gap-2"><span>1.</span> Be kind and respectful</li>
                            <li className="flex gap-2"><span>2.</span> No harassment or hate speech</li>
                            <li className="flex gap-2"><span>3.</span> Keep personal info private</li>
                            <li className="flex gap-2"><span>4.</span> Support each other</li>
                        </ul>
                    </div>
                </div>

                {/* ── CENTER COLUMN ── */}
                <div className="lg:col-span-6 space-y-5">
                    {posts.length === 0 ? (
                        <div className="rounded-3xl p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No posts yet in this community.</p>
                            <p className="text-sm mt-2">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="rounded-2xl p-6 shadow-lg hover:border-purple-500/30 transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid var(--border-color)' }}>
                                            <User className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                                {post.is_anonymous ? 'Anonymous' : (post.author_details?.first_name || post.author_details?.username)}
                                            </p>
                                            <p className="text-xs flex items-center" style={{ color: 'var(--text-secondary)' }}>
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {currentUserId === post.author_id && (
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="p-2 rounded-lg transition-colors"
                                            style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}
                                            title="Delete post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                                <p className="text-sm mb-4 whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{post.content}</p>

                                {post.image_url && (
                                    <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                                        <img
                                            src={post.image_url.startsWith('http') ? post.image_url : `http://localhost:8000${post.image_url}`}
                                            alt={post.title}
                                            className="w-full object-cover max-h-96"
                                        />
                                    </div>
                                )}

                                {post.video_url && (
                                    <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                                        <video
                                            src={post.video_url.startsWith('http') ? post.video_url : `http://localhost:8000${post.video_url}`}
                                            controls
                                            className="w-full max-h-96"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center space-x-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <button
                                        onClick={() => handleUpvote(post.id)}
                                        className={`flex items-center space-x-2 text-sm transition-all duration-300 ${post.is_upvoted ? 'font-bold' : ''}`}
                                        style={{ color: post.is_upvoted ? '#f472b6' : 'var(--text-secondary)' }}
                                    >
                                        <ThumbsUp className={`w-5 h-5 ${post.is_upvoted ? 'fill-current' : ''}`} />
                                        <span>{post.upvote_count} Upvotes</span>
                                    </button>
                                    <button
                                        onClick={() => toggleComments(post.id)}
                                        className="flex items-center space-x-2 text-sm transition-colors"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span>{post.comments?.length || 0} Comments</span>
                                        {expandedPost === post.id ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {expandedPost === post.id && (
                                    <div className="mt-4 pt-4 animate-in slide-in-from-top-2 duration-300" style={{ borderTop: '1px solid var(--border-color)' }}>
                                        <CommentInput
                                            postId={post.id}
                                            onSubmit={fetchPosts}
                                        />
                                        <CommentThread
                                            comments={post.comments || []}
                                            postId={post.id}
                                            postAuthorId={post.author_id}
                                            onCommentAdded={fetchPosts}
                                            currentUserId={currentUserId || undefined}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="rounded-2xl p-6 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Top Members</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid var(--border-color)' }}>
                                        <User className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>User {idx + 1}</div>
                                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{(4 - idx) * 12} contributions</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
