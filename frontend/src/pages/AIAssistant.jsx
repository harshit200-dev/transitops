import { useState, useRef, useEffect } from 'react';
import { aiService } from '@/services';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User, Zap } from 'lucide-react';

const SUGGESTIONS = [
  'Which vehicles need maintenance?',
  'Which vehicles have high fuel consumption?',
  'How can I reduce operational costs?',
  'Which drivers have safety risks?',
  'What is the fleet utilization rate?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm TransitOps AI Assistant. I can analyze your fleet data and answer questions about maintenance, fuel consumption, costs, and driver safety. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await aiService.chat(msg);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot size={24} className="text-purple-400" /> AI Assistant
        </h1>
        <p className="text-gray-400 text-sm mt-1">Powered by fleet data analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat */}
        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl flex flex-col" style={{ height: '600px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                  {m.role === 'assistant' ? <Zap size={16} className="text-white" /> : <User size={16} className="text-white" />}
                </div>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'assistant'
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-purple-600 text-white'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <div className="bg-gray-800 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="Ask about your fleet..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                disabled={loading}
              />
              <Button onClick={() => send()} disabled={loading || !input.trim()}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Suggested Questions</h3>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              disabled={loading}
              className="w-full text-left bg-gray-900 border border-gray-800 hover:border-purple-600/50 hover:bg-gray-800 rounded-xl p-3 text-sm text-gray-300 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
