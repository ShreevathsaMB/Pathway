import { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIChatProps {
    pendingMessage?: string | null;
    onMessageSent?: () => void;
    userName?: string;
    aiName?: string;
}

export default function AIChat({ pendingMessage, onMessageSent, userName, aiName }: AIChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState<any>(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initChat();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle pending message from Emergency Tips
    useEffect(() => {
        if (pendingMessage && conversation && !sending) {
            setInput(pendingMessage);
            // Auto-send after a short delay to ensure UI updates
            setTimeout(() => {
                handleSendMessage(pendingMessage);
                if (onMessageSent) onMessageSent();
            }, 100);
        }
    }, [pendingMessage, conversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const initChat = async () => {
        try {
            // Get existing conversations
            const response = await axios.get('/ai/conversations/');
            let activeConv = response.data[0];

            // If no conversation, create one
            if (!activeConv) {
                const createRes = await axios.post('/ai/conversations/', {});
                activeConv = createRes.data;
            }

            setConversation(activeConv);
            setMessages(activeConv.messages || []);
        } catch (error) {
            console.error('Failed to init chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (messageToSend?: string) => {
        const userMsg = messageToSend || input.trim();
        if (!userMsg || !conversation || sending) return;

        setInput('');
        setSending(true);

        // Optimistically add user message
        const tempUserMsg = { role: 'user', content: userMsg, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            const response = await axios.post(`ai/conversations/${conversation.id}/send/`, {
                content: userMsg
            });

            // Add AI response
            setMessages(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Fallback message if AI fails
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting right now. Please check your internet or try again later."
            }]);
        } finally {
            setSending(false);
        }
    };

    const handleSend = () => handleSendMessage();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                {messages.length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                            <Bot className="w-10 h-10 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Hi {userName}, I am {aiName}. How can I help you today?
                        </h3>
                        <p className="max-w-sm text-sm" style={{ color: 'var(--text-secondary)' }}>You can share anything on your mind, completely judgment-free.</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end space-x-3 max-w-[85%]`}>
                            {msg.role !== 'user' && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-md" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                                    <Bot className="w-4 h-4 text-purple-500" />
                                </div>
                            )}
                            <div
                                className={`px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm border border-purple-500/20'
                                    : 'rounded-bl-sm'
                                    }`}
                                style={msg.role !== 'user' ? { background: 'var(--bg-card-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' } : {}}
                            >
                                {msg.role === 'assistant' ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-3 space-y-1.5" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-3 space-y-1.5" {...props} />,
                                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-bold text-purple-600 dark:text-purple-400" {...props} />,
                                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-4" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-4" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3" {...props} />,
                                            a: ({node, ...props}) => <a className="text-blue-500 hover:text-blue-600 underline" {...props} />,
                                            code: ({node, className, children, ...props}: any) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return match ? (
                                                    <div className="bg-black/10 dark:bg-white/5 rounded-lg p-3 my-3 overflow-x-auto text-[13px] font-mono border border-black/10 dark:border-white/10">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </div>
                                                ) : (
                                                    <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[13px] font-mono font-semibold" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {sending && (
                    <div className="flex justify-start">
                        <div className="flex items-end space-x-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-md" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                                <Bot className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center space-x-2" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-transparent relative z-20">
                <div className="flex space-x-3 max-w-4xl mx-auto items-end">
                    <div className="flex-1 rounded-[32px] overflow-hidden focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Share what's on your mind..."
                            className="w-full bg-transparent py-4 outline-none resize-none max-h-32 min-h-[56px] placeholder-slate-400 dark:placeholder-slate-500"
                            disabled={sending}
                            rows={1}
                            style={{ height: 'auto', color: 'var(--text-primary)', paddingLeft: '20px', paddingRight: '20px' }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        className={`h-[56px] w-[56px] rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                            (!input.trim() || sending) 
                                ? 'cursor-not-allowed opacity-50' 
                                : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_8px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95'
                        }`}
                        style={(!input.trim() || sending) ? { background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' } : {}}
                        disabled={!input.trim() || sending}
                    >
                        <Send className="w-5 h-5 ml-1" />
                    </button>
                </div>
                <p className="text-[11px] text-slate-500 text-center mt-3 font-medium">
                    AI companion is here to support, not replace professional help.
                </p>
            </div>
        </div>
    );
}
