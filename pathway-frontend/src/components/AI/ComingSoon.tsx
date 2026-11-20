import { Mic, Video } from 'lucide-react';

interface ComingSoonProps {
    feature: 'Voice' | 'Video';
}

export default function ComingSoon({ feature }: ComingSoonProps) {
    const icon = feature === 'Voice' ? Mic : Video;
    const Icon = icon;

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center px-6">
            <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
                <Icon className="w-16 h-16 text-purple-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {feature} Chat Coming Soon
            </h2>

            <p className="text-gray-600 max-w-md mb-6">
                We're working on bringing you {feature.toLowerCase()} conversations with your AI companion.
                This feature will allow you to connect in a more personal and interactive way.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 max-w-md">
                <p className="text-sm text-purple-800 font-semibold mb-2">
                    What to expect:
                </p>
                <ul className="text-sm text-purple-700 text-left space-y-1">
                    {feature === 'Voice' ? (
                        <>
                            <li>• Natural voice conversations</li>
                            <li>• Real-time emotional support</li>
                            <li>• Hands-free interaction</li>
                        </>
                    ) : (
                        <>
                            <li>• Face-to-face video sessions</li>
                            <li>• Visual emotional cues</li>
                            <li>• More personal connection</li>
                        </>
                    )}
                </ul>
            </div>

            <p className="text-xs text-gray-400 mt-8">
                Stay tuned for updates!
            </p>
        </div>
    );
}
