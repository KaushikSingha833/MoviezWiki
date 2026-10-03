"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { chatWithEXXO } from "@/actions/aiActions";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: "user" | "model";
  parts: { text: string }[];
};

export default function WikiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hi there! I'm **EXXO**, your AI movie expert! What kind of movie or show are you looking for today?" }] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const updatedMessages: Message[] = [...messages, { role: "user", parts: [{ text: userMessage }] }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Exclude the very first greeting message from history to save tokens
      const historyToPass = updatedMessages.slice(1);
      
      const response = await chatWithEXXO(userMessage, historyToPass.slice(0, -1));
      
      setMessages([...updatedMessages, { role: "model", parts: [{ text: response }] }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "model", parts: [{ text: "Oops, something went wrong on my end!" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[9000]">
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-50 animate-ping" />
        )}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: isOpen ? 0 : 1, rotate: isOpen ? 180 : 0 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.6)] flex items-center justify-center text-white border-2 border-white/20"
        >
          <Bot className="w-7 h-7" />
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.8 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9000] w-full sm:w-[400px] h-[100dvh] sm:h-[550px] sm:max-h-[85vh] bg-neutral-900/90 backdrop-blur-2xl sm:border border-white/10 sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-5 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-black border-b border-white/5 overflow-hidden">
              <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">EXXO</h3>
                  <p className="text-xs text-indigo-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm' 
                        : 'bg-neutral-800/80 backdrop-blur-sm text-neutral-200 border border-white/5 rounded-bl-sm prose prose-invert prose-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.parts[0].text}</p>
                    ) : (
                      <div className="leading-relaxed">
                        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-neutral-800/80 backdrop-blur-sm border border-white/5 px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    </span>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Thinking</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask EXXO..."
                  className="flex-1 bg-black/50 border border-neutral-700 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-full transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
