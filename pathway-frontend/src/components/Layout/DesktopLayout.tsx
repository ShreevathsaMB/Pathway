import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DesktopLayout() {
    const location = useLocation();
    // Pages that need full-bleed layout (no content-area padding, no scroll)
    const isFullscreen = ['/ai'].includes(location.pathname);

    return (
        <div className="desktop-container">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className={`content-area${isFullscreen ? ' content-area--fullscreen' : ''}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
