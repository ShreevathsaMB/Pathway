import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Search, MessageSquare, Users, ArrowRight } from 'lucide-react';

const COMMUNITY_GRADIENTS = [
    { from: '#6d28d9', to: '#4338ca' },  // purple-indigo
    { from: '#0891b2', to: '#0e7490' },  // teal-cyan
    { from: '#be185d', to: '#9d174d' },  // rose-pink
    { from: '#1d4ed8', to: '#4338ca' },  // blue-indigo
    { from: '#b45309', to: '#d97706' },  // amber-orange
    { from: '#059669', to: '#0d9488' },  // green-teal
];

export default function CommunityList() {
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const response = await axios.get('community/list/');
            const data = response.data.results || response.data;
            setCommunities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch communities:', error);
            setCommunities([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = communities.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPosts = communities.reduce((s, c) => s + (c.post_count || 0), 0);
    const totalMembers = communities.reduce((s, c) => s + (c.active_members || 0), 0);

    if (loading) {
        return (
            <div className="hg-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, border: '4px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    return (
        <div className="hg-root">
            {/* Background orbs */}
            <div className="hg-orb hg-orb-1" />
            <div className="hg-orb hg-orb-2" />
            <div className="hg-orb hg-orb-3" />

            {/* ── HEADER ── */}
            <div className="cl-header-card">
                <div className="cl-header-left">
                    <p className="cl-header-eyebrow">🏘️ Pathway Network</p>
                    <h1 className="cl-header-title">Our Communities</h1>
                    <p className="cl-header-sub">Find your tribe — people who truly understand your journey</p>
                </div>
                <div className="cl-header-right">
                    <div className="cl-search-wrap">
                        <Search size={16} className="cl-search-icon" />
                        <input
                            className="cl-search-input"
                            placeholder="Search communities..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── STATS STRIP ── */}
            <div className="cl-stats-strip">
                <div className="cl-stat-chip">
                    <span className="cl-stat-num">{communities.length}</span>
                    <span className="cl-stat-lbl">Communities</span>
                </div>
                <div className="cl-stat-chip">
                    <span className="cl-stat-num">{totalMembers}</span>
                    <span className="cl-stat-lbl">Active Members</span>
                </div>
                <div className="cl-stat-chip">
                    <span className="cl-stat-num">{totalPosts}</span>
                    <span className="cl-stat-lbl">Total Posts</span>
                </div>
                <div className="cl-stat-chip cl-stat-live">
                    <span className="cl-live-dot" />
                    <span className="cl-stat-lbl">Live Now</span>
                </div>
            </div>

            {/* ── COMMUNITY GRID ── */}
            {filtered.length === 0 ? (
                <div className="cl-empty">
                    <Users size={48} style={{ color: '#374151', marginBottom: 12 }} />
                    <p style={{ color: '#475569', fontSize: '1rem' }}>
                        {search ? `No communities matching "${search}"` : 'No communities yet.'}
                    </p>
                </div>
            ) : (
                <div className="cl-grid">
                    {filtered.map((community, i) => {
                        const grad = COMMUNITY_GRADIENTS[i % COMMUNITY_GRADIENTS.length];
                        return (
                            <Link
                                key={community.slug}
                                to={`/community/${community.slug}`}
                                className="cl-card"
                                style={{ '--grad-from': grad.from, '--grad-to': grad.to } as React.CSSProperties}
                            >
                                {/* Gradient background */}
                                <div className="cl-card-bg" style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }} />

                                {/* Decorative blobs */}
                                <div className="cl-card-blob cl-blob-1" />
                                <div className="cl-card-blob cl-blob-2" />

                                <div className="cl-card-inner">
                                    {/* Emoji icon */}
                                    <div className="cl-card-emoji">{community.icon}</div>

                                    {/* Name & desc */}
                                    <h3 className="cl-card-name">{community.name}</h3>
                                    <p className="cl-card-desc">{community.description}</p>

                                    {/* Stats row */}
                                    <div className="cl-card-stats">
                                        <div className="cl-card-stat">
                                            <MessageSquare size={13} />
                                            <span>{community.post_count ?? 0} posts</span>
                                        </div>
                                        <div className="cl-card-stat">
                                            <Users size={13} />
                                            <span>{community.active_members ?? 0} members</span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="cl-card-cta">
                                        <span>Join Discussion</span>
                                        <ArrowRight size={15} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
