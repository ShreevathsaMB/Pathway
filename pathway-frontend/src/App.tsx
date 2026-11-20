import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DesktopLayout from './components/Layout/DesktopLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import LandingPage from './components/Landing/LandingPage';
import Home from './components/Home/Home';
import Tasks from './components/Tasks/Tasks';
import CommunityList from './components/Community/CommunityList';
import CommunityDetail from './components/Community/CommunityDetail';
import CreatePost from './components/Create/CreatePost';
import AICompanionTabs from './components/AI/AICompanionTabs';
import Resources from './components/Resources/Resources';
import Safety from './components/Safety/Safety';
import Profile from './components/Auth/Profile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-600 font-semibold">Loading Pathway...</p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider>
            <LanguageProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/landing" element={<LandingPage onGuestLogin={() => setIsAuthenticated(true)} />} />
                        <Route path="/login" element={
                            isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
                        } />
                        <Route path="/signup" element={
                            isAuthenticated ? <Navigate to="/" /> : <Signup setIsAuthenticated={setIsAuthenticated} />
                        } />

                        {/* Protected routes */}
                        <Route path="/" element={
                            isAuthenticated ? <DesktopLayout /> : <LandingPage onGuestLogin={() => setIsAuthenticated(true)} />
                        }>
                            <Route index element={<Home />} />
                            <Route path="tasks" element={<Tasks />} />
                            <Route path="community" element={<CommunityList />} />
                            <Route path="community/:id" element={<CommunityDetail />} />
                            <Route path="create" element={<CreatePost />} />
                            <Route path="ai" element={<AICompanionTabs />} />
                            <Route path="resources" element={<Resources />} />
                            <Route path="safety" element={<Safety />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </Router>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
