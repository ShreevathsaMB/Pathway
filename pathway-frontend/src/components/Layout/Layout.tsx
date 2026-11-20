import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Users, PlusCircle, Bot, BookOpen, Shield, User, LogOut } from 'lucide-react';
import logo from '../../assets/logo_serene_path.svg';

interface LayoutProps {
    setIsAuthenticated: (value: boolean) => void;
}

export default function Layout({ setIsAuthenticated }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
        { path: '/community', icon: Users, label: 'Community' },
        { path: '/create', icon: PlusCircle, label: 'Create' },
        { path: '/ai', icon: Bot, label: 'AI' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar / Desktop Header */}
            <header className="gradient-primary text-white sticky top-0 z-30 shadow-md w-full flex justify-center">
                <div className="w-full max-w-4xl flex justify-between items-center px-4 py-4">
                    <div className="flex items-center gap-x-10">
                        <Link to="/" className="flex items-center gap-x-2 text-2xl font-bold tracking-tight">
                            <img src={logo} alt="Pathway Logo" className="w-8 h-8 brightness-0 invert" />
                            <span>Pathway</span>
                        </Link>

                        {/* Desktop Main Nav */}
                        <nav className="hidden md:flex items-center gap-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isActive(item.path)
                                        ? 'bg-white/20 text-white shadow-sm'
                                        : 'text-purple-100 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Link to="/resources" title="Resources" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <BookOpen className="w-5 h-5 md:w-6 h-6" />
                        </Link>
                        <Link to="/safety" title="Safety" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Shield className="w-5 h-5 md:w-6 h-6" />
                        </Link>
                        <Link to="/profile" title="Profile" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <User className="w-5 h-5 md:w-6 h-6" />
                        </Link>
                        <button onClick={handleLogout} title="Logout" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <LogOut className="w-5 h-5 md:w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col items-center">
                <div className="w-full max-w-4xl px-4 py-6 md:py-10">
                    <Outlet />
                </div>
            </main>

            {/* Navigation Spacer for Mobile */}
            <div className="h-20 md:hidden" aria-hidden="true"></div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
                <div className="grid grid-cols-5 items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center py-3 px-1 transition-all ${isActive(item.path)
                                ? 'text-purple-600'
                                : 'text-gray-400 hover:text-purple-500'
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
