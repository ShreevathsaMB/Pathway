import { useNavigate } from 'react-router-dom';
import { MessageCircle, AlertCircle } from 'lucide-react';

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="card">
            <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
            <button
                className="quick-action-btn primary"
                onClick={() => navigate('/ai')}
            >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Alex</span>
            </button>
            <button
                className="quick-action-btn emergency"
                onClick={() => navigate('/safety')}
            >
                <AlertCircle className="w-5 h-5" />
                <span>Emergency Help</span>
            </button>
        </div>
    );
}
