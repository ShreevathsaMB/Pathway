import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Image as ImageIcon, Video, X, Sparkles, ArrowLeft, PenLine } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MOODS = [
    { id: 'advice', label: 'Seeking Advice', emoji: '🙋' },
    { id: 'story', label: 'My Story', emoji: '📖' },
    { id: 'milestone', label: 'Milestone', emoji: '🏆' },
];

const COMMUNITY_GRADIENTS: Record<number, string> = {
    0: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    1: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
    2: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
    3: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    4: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    5: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
};

export default function CreatePost() {
    const [communities, setCommunities] = useState<any[]>([]);
    const [formData, setFormData] = useState({ community: '', title: '', content: '', is_anonymous: false, mood: '' });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await axios.get('community/list/');
                const data = response.data.results || response.data;
                const list = Array.isArray(data) ? data : [];
                setCommunities(list);
                if (list.length > 0) setFormData(prev => ({ ...prev, community: list[0].id.toString() }));
            } catch { /* silent */ }
        };
        fetchCommunities();
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); }
    };
    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setSelectedVideo(file); setVideoPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.community || !formData.title || !formData.content) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('community', formData.community);
            const moodLabel = MOODS.find(m => m.id === formData.mood)?.label;
            fd.append('title', moodLabel ? `[${moodLabel}] ${formData.title}` : formData.title);
            fd.append('content', formData.content);
            fd.append('is_anonymous', formData.is_anonymous.toString());
            if (selectedImage) fd.append('image', selectedImage);
            if (selectedVideo) fd.append('video', selectedVideo);
            await axios.post('community/posts/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/community');
        } catch { /* silent */ } finally { setLoading(false); }
    };

    // Theme-aware panel styles
    const panelBg = isDarkMode
        ? 'rgba(10, 25, 47, 0.92)'
        : 'rgba(255, 255, 255, 0.97)';
    const rightPanelBg = isDarkMode
        ? 'rgba(15, 15, 30, 0.90)'
        : 'rgba(255, 255, 255, 0.97)';
    const panelBorder = isDarkMode
        ? 'rgba(124, 58, 237, 0.3)'
        : 'rgba(124, 58, 237, 0.15)';
    const rightPanelBorder = isDarkMode
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.08)';

    return (
        <div className="hg-root" style={{ height: '100%', minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Rich background orbs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 65%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.22), transparent 65%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div className="relative z-10 flex flex-col w-full flex-1" style={{ padding: '16px 20px', maxWidth: '1400px', margin: '0 auto', overflow: 'hidden', height: '100%' }}>

                {/* Back Button */}
                <div className="mb-5">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>

                {/* ── SPLIT HERO BODY ── */}
                <form onSubmit={handleSubmit} className="flex gap-5 flex-1" style={{ minHeight: 0, overflow: 'hidden', minWidth: 0 }}>

                    {/* ══ LEFT PANEL ══ */}
                    <div
                        className="flex-shrink-0 flex flex-col rounded-[28px] overflow-hidden relative backdrop-blur-xl shadow-xl"
                        style={{
                            width: '300px',
                            background: panelBg,
                            border: `1px solid ${panelBorder}`,
                            boxShadow: isDarkMode
                                ? '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
                                : '0 8px 32px rgba(0,0,0,0.08)',
                        }}
                    >
                        {/* Top purple/teal glow inside left panel */}
                        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 60%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(14,165,233,0.2), transparent 60%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

                        <div className="relative z-10 flex flex-col h-full overflow-y-auto custom-scrollbar" style={{ padding: '28px 20px' }}>

                            {/* Big heading */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <PenLine className="w-5 h-5" style={{ color: 'rgba(168,85,247,0.8)' }} />
                                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(168,85,247,0.8)' }}>Create Post</span>
                                </div>
                                <h1 className="text-4xl font-black leading-tight mb-3" style={{ color: 'var(--text-primary)', textShadow: '0 0 40px rgba(124,58,237,0.3)' }}>
                                    Share<br />Your<br />Story
                                </h1>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    "You are not alone. Your experiences connect you with people who truly understand your journey."
                                </p>
                            </div>

                            {/* Community Selector Pills */}
                            <div className="mb-6">
                                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Community</p>
                                <div className="flex flex-col gap-2">
                                    {communities.map((comm, idx) => {
                                        const isActive = formData.community === comm.id.toString();
                                        const gradient = COMMUNITY_GRADIENTS[idx % 6];
                                        return (
                                            <button
                                                key={comm.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, community: comm.id.toString() })}
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 relative overflow-hidden"
                                                style={{
                                                    background: isActive ? gradient : 'var(--bg-card-hover)',
                                                    border: isActive ? '1px solid rgba(168,85,247,0.5)' : '1px solid var(--border-color)',
                                                    boxShadow: isActive ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                                                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                                }}
                                            >
                                                {isActive && <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(15px)', pointerEvents: 'none' }} />}
                                                <span className="text-lg relative z-10">{comm.icon}</span>
                                                <span className="text-sm font-bold relative z-10" style={{ color: isActive ? 'white' : 'var(--text-primary)' }}>{comm.name}</span>
                                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white/70 relative z-10 flex-shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mood Pills */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Mood</p>
                                <div className="flex flex-wrap gap-2">
                                    {MOODS.map(mood => {
                                        const isActive = formData.mood === mood.id;
                                        return (
                                            <button
                                                key={mood.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mood: isActive ? '' : mood.id })}
                                                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all duration-200"
                                                style={{
                                                    background: isActive ? (isDarkMode ? 'rgba(236,72,153,0.25)' : 'rgba(236,72,153,0.1)') : 'var(--bg-card-hover)',
                                                    border: isActive ? '1px solid rgba(236,72,153,0.5)' : '1px solid var(--border-color)',
                                                    color: isActive ? (isDarkMode ? '#f9a8d4' : '#db2777') : 'var(--text-secondary)',
                                                    boxShadow: isActive ? '0 0 15px rgba(236,72,153,0.3)' : 'none',
                                                }}
                                            >
                                                {mood.emoji} {mood.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT PANEL ══ */}
                    <div
                        className="flex-1 flex flex-col rounded-[28px] overflow-hidden backdrop-blur-xl shadow-xl"
                        style={{
                            background: rightPanelBg,
                            border: `1px solid ${rightPanelBorder}`,
                            boxShadow: isDarkMode
                                ? '0 24px 60px rgba(0,0,0,0.4)'
                                : '0 8px 32px rgba(0,0,0,0.08)',
                        }}
                    >
                        <div className="flex flex-col h-full" style={{ padding: '28px 32px', gap: '20px' }}>

                            {/* Title */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(168,85,247,0.7)' }}>Title</label>
                                <input
                                    type="text"
                                    placeholder="Give your post a title..."
                                    className="w-full bg-transparent text-xl font-bold focus:outline-none pb-3"
                                    style={{ borderBottom: '1px solid rgba(124,58,237,0.3)', color: 'var(--text-primary)' }}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required maxLength={150}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(168,85,247,0.7)' }}>Your Story</label>
                                <textarea
                                    placeholder="Write your story here..."
                                    className="w-full h-full bg-transparent text-base focus:outline-none resize-none"
                                    style={{ minHeight: '200px', color: 'var(--text-primary)' }}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    required rows={8}
                                />
                            </div>

                            {/* Media previews */}
                            {(imagePreview || videoPreview) && (
                                <div className="flex flex-wrap gap-3">
                                    {imagePreview && (
                                        <div className="relative group">
                                            <img src={imagePreview} alt="Preview" className="h-24 w-auto rounded-xl object-cover" style={{ border: '1px solid var(--border-color)' }} />
                                            <button type="button" className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedImage(null); setImagePreview(null); }}><X size={12} /></button>
                                        </div>
                                    )}
                                    {videoPreview && (
                                        <div className="relative group">
                                            <video src={videoPreview} className="h-24 w-auto rounded-xl object-cover" style={{ border: '1px solid var(--border-color)' }} />
                                            <button type="button" className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedVideo(null); setVideoPreview(null); }}><X size={12} /></button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Divider */}
                            <hr style={{ borderColor: 'var(--border-color)' }} />

                            {/* Footer */}
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Media upload */}
                                    {!imagePreview && (
                                        <>
                                            <input type="file" id="img-up" accept="image/*" onChange={handleImageSelect} hidden />
                                            <label htmlFor="img-up" className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                                <ImageIcon size={15} className="text-purple-500" /> Photo
                                            </label>
                                        </>
                                    )}
                                    {!videoPreview && (
                                        <>
                                            <input type="file" id="vid-up" accept="video/*" onChange={handleVideoSelect} hidden />
                                            <label htmlFor="vid-up" className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                                <Video size={15} className="text-pink-500" /> Video
                                            </label>
                                        </>
                                    )}

                                    {/* Anonymous toggle */}
                                    <label className="flex items-center gap-2 cursor-pointer ml-2">
                                        <input type="checkbox" checked={formData.is_anonymous} onChange={e => setFormData({ ...formData, is_anonymous: e.target.checked })} hidden />
                                        <div className="w-10 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center" style={{ background: formData.is_anonymous ? '#7c3aed' : 'var(--bg-card-hover)', boxShadow: formData.is_anonymous ? '0 0 10px rgba(124,58,237,0.5)' : 'none', border: '1px solid var(--border-color)' }}>
                                            <div className="bg-white w-4 h-4 rounded-full shadow transition-transform duration-300" style={{ transform: formData.is_anonymous ? 'translateX(20px)' : 'translateX(0)' }} />
                                        </div>
                                        <span className="text-xs font-semibold" style={{ color: formData.is_anonymous ? '#a78bfa' : 'var(--text-secondary)' }}>
                                            {formData.is_anonymous ? 'Anonymous' : 'Post Anonymously'}
                                        </span>
                                    </label>
                                </div>

                                {/* Publish Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title || !formData.content}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                                    style={{
                                        background: (loading || !formData.title || !formData.content) ? 'var(--bg-card-hover)' : 'linear-gradient(to right, #7c3aed, #db2777)',
                                        color: (loading || !formData.title || !formData.content) ? 'var(--text-secondary)' : 'white',
                                        border: '1px solid var(--border-color)',
                                        cursor: (loading || !formData.title || !formData.content) ? 'not-allowed' : 'pointer',
                                        boxShadow: (loading || !formData.title || !formData.content) ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
                                    }}
                                >
                                    <Sparkles size={16} />
                                    {loading ? 'Publishing...' : 'Publish ✨'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
