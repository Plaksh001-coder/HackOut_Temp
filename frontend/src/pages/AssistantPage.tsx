import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Sliders,
  HelpCircle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { sendChatMessage } from '../services/api';
import { ChatMessage } from '../types';

export const AssistantPage: React.FC = () => {
  const { factory, updateActivityData, updateSimParams, setActiveTab } = useFactory();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: 'What would you like to explore about your factory?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(text, factory.id, messages);

      // If backend extracted structured activity data, update factory context!
      if (response.extracted_data) {
        const toUpdate: any = {};
        if (response.extracted_data.electricity_kwh) toUpdate.electricity_kwh = response.extracted_data.electricity_kwh;
        if (response.extracted_data.natural_gas_m3) toUpdate.natural_gas_m3 = response.extracted_data.natural_gas_m3;
        if (response.extracted_data.waste_tonnes) toUpdate.waste_tonnes = response.extracted_data.waste_tonnes;
        if (Object.keys(toUpdate).length > 0) {
          updateActivityData(toUpdate);
        }
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredAction: response.structured_action
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-sage-200 shadow-card overflow-hidden animate-in fade-in">
      {/* Assistant Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 text-white flex items-center justify-between border-b border-forest-900 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mint-500 text-forest-950 flex items-center justify-center shadow-soft font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-display">GreenMind Assistant</h2>
              <span className="text-[10px] bg-mint-500/20 text-mint-300 px-2 py-0.5 rounded-full border border-mint-400/30 font-semibold">
                Deterministic Calculation Guard
              </span>
            </div>
            <p className="text-xs text-sage-200">
              Assisting {factory.name} • Natural Language Factory Data Ingestion & Analysis
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl text-sage-300 hover:text-white hover:bg-forest-800 transition-colors"
          title="Clear Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-forest-900 text-white shadow-soft'
                  : 'bg-mint-50 text-forest-900 border border-mint-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-mint-600" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-forest-900 text-white shadow-soft'
                  : 'bg-sage-50/80 text-industrial-900 border border-sage-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Action Chip from Structured Bot Action */}
              {msg.structuredAction && (
                <div className="mt-3 pt-3 border-t border-sage-200/80 flex items-center gap-2">
                  {msg.structuredAction.type === 'VIEW_HOTSPOTS' && (
                    <button
                      onClick={() => setActiveTab('hotspots')}
                      className="px-3 py-1.5 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    >
                      <span>Open Hotspot Detection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {msg.structuredAction.type === 'VIEW_RECOMMENDATIONS' && (
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="px-3 py-1.5 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    >
                      <span>Explore Interventions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {msg.structuredAction.type === 'SIMULATION_RESULT' && (
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="px-3 py-1.5 bg-mint-500 hover:bg-mint-400 text-forest-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    >
                      <span>Open What-If Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <span className={`block text-[10px] mt-2 font-mono ${msg.sender === 'user' ? 'text-sage-300' : 'text-industrial-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-mint-50 border border-mint-200 text-forest-900 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-mint-600 animate-pulse" />
            </div>
            <div className="bg-sage-50 rounded-2xl px-4 py-3 border border-sage-200 text-xs text-industrial-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mint-500 animate-ping" />
              <span>Calculating authoritative metrics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-sage-50/60 border-t border-sage-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-industrial-400 whitespace-nowrap">
          Recommended Questions:
        </span>
        <button
          onClick={() => handleQuickPrompt("What is our largest emission hotspot and why?")}
          className="px-3 py-1 rounded-full bg-white hover:bg-sage-100 border border-sage-200 text-industrial-700 whitespace-nowrap transition-all text-[11px] font-medium"
        >
          What is our biggest emission hotspot?
        </button>
        <button
          onClick={() => handleQuickPrompt("What can we reduce within our ₹5,00,000 budget?")}
          className="px-3 py-1 rounded-full bg-white hover:bg-sage-100 border border-sage-200 text-industrial-700 whitespace-nowrap transition-all text-[11px] font-medium"
        >
          What can we reduce within our budget?
        </button>
        <button
          onClick={() => handleQuickPrompt("Simulate a 20% cut in electricity consumption")}
          className="px-3 py-1 rounded-full bg-white hover:bg-sage-100 border border-sage-200 text-industrial-700 whitespace-nowrap transition-all text-[11px] font-medium"
        >
          What happens if we cut electricity by 20%?
        </button>
        <button
          onClick={() => handleQuickPrompt("Our factory uses 120,000 kWh electricity and 30,000 m3 natural gas")}
          className="px-3 py-1 rounded-full bg-white hover:bg-sage-100 border border-sage-200 text-industrial-700 whitespace-nowrap transition-all text-[11px] font-medium"
        >
          Update our electricity and gas numbers
        </button>
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-sage-200 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask GreenMind Assistant or type activity data (e.g. 'We use 100,000 kWh electricity')..."
            className="flex-1 px-4 py-3 rounded-2xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-mint-500 text-xs sm:text-sm text-forest-950 placeholder:text-industrial-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-forest-900 hover:bg-forest-850 disabled:opacity-50 text-white transition-all shadow-soft"
          >
            <Send className="w-5 h-5 text-mint-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
