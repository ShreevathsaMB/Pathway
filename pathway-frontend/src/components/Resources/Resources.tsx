import { useState } from 'react';
import { Play, Music, BookOpen, Book, Activity, Heart } from 'lucide-react';

interface Resource {
    id: number;
    type: 'video' | 'music' | 'article' | 'book' | 'exercise';
    title: string;
    description: string;
    duration: string;
    language: string;
    url: string;
    icon: string;
}

const resourcesData: Resource[] = [
    // Videos
    {
        id: 1,
        type: 'video',
        title: 'Peace Through Meditation',
        description: 'Learn simple breathing techniques to calm your mind and find inner peace',
        duration: '5 min',
        language: 'తెలుగు',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        icon: '▶️'
    },
    {
        id: 2,
        type: 'video',
        title: 'Bhagavad Gita - Chapter 2',
        description: 'Understanding the path of duty and wisdom in modern life',
        duration: '8 min',
        language: 'हिन्दी',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        icon: '▶️'
    },
    {
        id: 3,
        type: 'video',
        title: 'Success Story: Overcoming Depression',
        description: 'Real journey from darkness to light - how meditation and community helped',
        duration: '12 min',
        language: 'தமிழ்',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        icon: '▶️'
    },
    // Music
    {
        id: 4,
        type: 'music',
        title: 'Morning Peace Playlist',
        description: 'Soothing music to start your day with calm and positivity',
        duration: '20 min',
        language: 'Instrumental',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u',
        icon: '🎵'
    },
    {
        id: 5,
        type: 'music',
        title: 'Evening Calm - Sleep Sounds',
        description: 'Peaceful sounds and mantras for better sleep and relaxation',
        duration: '30 min',
        language: 'Mantras',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u',
        icon: '🎵'
    },
    // Articles
    {
        id: 6,
        type: 'article',
        title: 'How to Talk to Parents About Marriage',
        description: 'Practical communication strategies for difficult family conversations',
        duration: '8 min read',
        language: 'English',
        url: 'https://example.com/article/marriage-communication',
        icon: '📖'
    },
    {
        id: 7,
        type: 'article',
        title: 'Understanding Depression: Signs & Solutions',
        description: 'Recognize symptoms and learn evidence-based coping strategies',
        duration: '10 min read',
        language: 'తెలుగు',
        url: 'https://example.com/article/depression-guide',
        icon: '📖'
    },
    // Books
    {
        id: 8,
        type: 'book',
        title: 'Bhagavad Gita (Telugu Translation)',
        description: 'Complete text with commentary and modern interpretation',
        duration: 'Book',
        language: 'తెలుగు',
        url: 'https://example.com/books/bhagavad-gita-telugu.pdf',
        icon: '📚'
    },
    {
        id: 9,
        type: 'book',
        title: 'The Art of Letting Go',
        description: 'Release past regrets and find peace in the present moment',
        duration: 'Book',
        language: 'English',
        url: 'https://example.com/books/art-of-letting-go.pdf',
        icon: '📚'
    },
    // Exercises
    {
        id: 10,
        type: 'exercise',
        title: 'Gratitude Journal Template',
        description: 'Daily practice to cultivate thankfulness and positive mindset',
        duration: '10 min',
        language: 'All Languages',
        url: 'https://example.com/templates/gratitude-journal.pdf',
        icon: '🧘'
    },
    {
        id: 11,
        type: 'exercise',
        title: 'Communication Scripts for Family',
        description: 'Templates to help you navigate difficult conversations with loved ones',
        duration: '15 min',
        language: 'English',
        url: 'https://example.com/templates/communication-scripts.pdf',
        icon: '🧘'
    },
    {
        id: 12,
        type: 'exercise',
        title: '5-Minute Breathing Exercise',
        description: 'Quick stress relief technique you can do anywhere, anytime',
        duration: '5 min',
        language: 'All Languages',
        url: 'https://example.com/exercises/breathing',
        icon: '🧘'
    },
];

export default function Resources() {
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<string>('popular');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const filters = [
        { id: 'all', label: 'All', icon: null },
        { id: 'video', label: 'Videos 📹', icon: Play },
        { id: 'music', label: 'Music 🎵', icon: Music },
        { id: 'article', label: 'Articles 📖', icon: BookOpen },
        { id: 'book', label: 'Books 📚', icon: Book },
        { id: 'exercise', label: 'Exercises 🧘', icon: Activity },
    ];

    const tabs = ['Popular', 'Recent', 'Saved'];

    const filteredResources = activeFilter === 'all'
        ? resourcesData
        : resourcesData.filter(r => r.type === activeFilter);

    const toggleFavorite = (id: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(id)) {
                newFavorites.delete(id);
            } else {
                newFavorites.add(id);
            }
            return newFavorites;
        });
    };

    const getGradientClass = (type: string) => {
        switch (type) {
            case 'video':
                return 'from-purple-500 to-purple-700';
            case 'music':
                return 'from-blue-400 to-cyan-400';
            case 'article':
                return 'bg-gray-100';
            case 'book':
                return 'from-pink-400 to-yellow-300';
            case 'exercise':
                return 'from-teal-400 to-indigo-900';
            default:
                return 'from-gray-400 to-gray-600';
        }
    };

    const getActionButton = (resource: Resource) => {
        switch (resource.type) {
            case 'video':
                return { text: '▶️ Watch', action: () => window.open(resource.url, '_blank') };
            case 'music':
                return { text: '🎵 Play', action: () => window.open(resource.url, '_blank') };
            case 'article':
                return { text: '📖 Read', action: () => window.open(resource.url, '_blank') };
            case 'book':
                return { text: '📥 Download PDF', action: () => window.open(resource.url, '_blank') };
            case 'exercise':
                return { text: '▶️ Start', action: () => window.open(resource.url, '_blank') };
            default:
                return { text: 'Open', action: () => window.open(resource.url, '_blank') };
        }
    };

    return (
        <div className="hg-root page-container" style={{ minHeight: '100%', position: 'relative' }}>
            {/* Background Orbs */}
            <div className="hg-orb hg-orb-1" style={{ top: '10%', left: '80%' }} />
            <div className="hg-orb hg-orb-2" style={{ top: '60%', left: '10%' }} />

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>📚 Resources Library</h1>
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Curated content to support your healing journey</p>
                </div>

                {/* Filter Bar */}
                <div className="flex gap-3 mb-8 flex-wrap justify-center md:justify-start">
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter.id;
                        return (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-5 py-2.5 rounded-full border transition-all duration-300 font-medium ${
                                    isActive
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-[0_4px_15px_rgba(124,58,237,0.3)]'
                                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-purple-400/50 hover:bg-slate-50 dark:hover:bg-white/10'
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-10 border-b border-slate-200 dark:border-white/10 overflow-x-auto hide-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                                    isActive
                                        ? 'text-slate-900 dark:text-white'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_-2px_10px_rgba(124,58,237,0.5)]"></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map((resource) => {
                        const button = getActionButton(resource);
                        const isFavorite = favorites.has(resource.id);

                        return (
                            <div
                                key={resource.id}
                                className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:border-purple-400 dark:hover:border-purple-500/30 transition-all duration-500 group flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div
                                    className={`h-48 flex items-center justify-center text-7xl relative overflow-hidden ${
                                        resource.type === 'article' 
                                            ? 'bg-slate-200 dark:bg-slate-800/50' 
                                            : `bg-gradient-to-br ${getGradientClass(resource.type)} opacity-90`
                                    }`}
                                >
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                    <span className={`transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl ${
                                        resource.type === 'article' ? 'text-purple-400' : 'text-white'
                                    }`}>
                                        {resource.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Meta */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm">
                                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.duration}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{resource.language}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                        {resource.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {resource.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-auto pt-4 border-t border-slate-200 dark:border-white/5">
                                        <button
                                            onClick={button.action}
                                            className="flex-1 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:border-transparent group-hover:shadow-[0_4px_15px_rgba(124,58,237,0.4)]"
                                        >
                                            {button.text}
                                        </button>
                                        <button
                                            onClick={() => toggleFavorite(resource.id)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                                                isFavorite
                                                    ? 'bg-pink-100 dark:bg-pink-500/20 border-pink-300 dark:border-pink-500/50 text-pink-500 dark:text-pink-400 scale-105 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-pink-300 dark:hover:border-pink-500/30 hover:text-pink-500 dark:hover:text-pink-400'
                                            }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-32 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl mt-8">
                        <div className="text-6xl mb-4 opacity-50">🔍</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Try selecting a different category from the filters above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
