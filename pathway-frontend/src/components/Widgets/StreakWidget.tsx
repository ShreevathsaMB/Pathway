interface StreakWidgetProps {
    currentStreak?: number;
}

export default function StreakWidget({ currentStreak = 0 }: StreakWidgetProps) {
    return (
        <div className="streak-card">
            <div style={{ fontSize: '1.2em', opacity: 0.9 }}>Your Streak</div>
            <div className="streak-number">{currentStreak}</div>
            <div>Days Strong! 🔥</div>
        </div>
    );
}
