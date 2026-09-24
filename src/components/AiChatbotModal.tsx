/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Zap,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { api } from "../services/api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  onNavigateToDealership?: () => void;
  onOpenQuickContact?: () => void;
}

const STARTER_PROMPTS = [
  "Is a driving license required for Volmo scooters?",
  "Compare Lead-Acid Graphene vs Lithium-Ion packs",
  "What is the range & mileage of the 72V 60Ah battery?",
  "Why is the 69V precision cutoff charger essential?",
  "What is the running cost per km compared to petrol?",
  "Tell me about the Volmo Phantom sport scooter",
];

const INITIAL_WELCOME: ChatMessage = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Hello! I am **Volmo AI Assistant**, powered by Gemini. Ask me anything about our 100% RTO-free electric scooters, battery technologies, charging guidelines, or technical specifications!",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function AiChatbotModal({
  isOpen,
  onClose,
  initialQuestion,
  onNavigateToDealership,
  onOpenQuickContact,
}: AiChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"gemini-3.5-flash" | "gemini-3.1-flash-lite">("gemini-3.5-flash");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Handle initialQuestion if provided
  useEffect(() => {
    if (isOpen && initialQuestion) {
      handleSendMessage(initialQuestion);
    }
  }, [isOpen, initialQuestion]);

  // Keyboard navigation: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history payload for the backend Gemini route
      const payload = newHistory.map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        content: m.content,
      }));

      const res = await api.chatbot.sendChat(payload, selectedModel);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.reply || "I am here to help! Could you please elaborate on your question?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chatbot request failed:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Volmo scooters are 100% RTO-Free with zero registration needed under CMVR rules! For further custom details, you can contact our technical sales desk directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME]);
    setInput("");
  };

  // Helper to format basic markdown-style text (bold, lists, paragraphs)
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Format bold text **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5">
            {formattedLine}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed my-1">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative flex flex-col h-[640px] max-h-[90vh] w-full sm:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-left"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                      <Sparkles size={20} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">
                        Volmo AI Technical Assistant
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                        Gemini AI
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Instant answers for EV scooter FAQs, batteries & engineering
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Clear history */}
                  <button
                    type="button"
                    onClick={handleResetChat}
                    title="Clear Conversation"
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={16} />
                  </button>

                  {/* Close modal */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Sub-bar: Model selection & quick info */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Model:</span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-200/70 border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setSelectedModel("gemini-3.5-flash")}
                      className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                        selectedModel === "gemini-3.5-flash"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Gemini 3.5 Flash
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel("gemini-3.1-flash-lite")}
                      className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                        selectedModel === "gemini-3.1-flash-lite"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      3.1 Flash Lite (Fast)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck size={12} />
                    Verified Technical Data
                  </span>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Bot size={16} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm ${
                          isUser
                            ? "bg-slate-900 text-white rounded-tr-none shadow-md shadow-slate-900/10"
                            : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <div className={isUser ? "text-slate-100" : "text-slate-700 space-y-1"}>
                          {renderMessageContent(msg.content)}
                        </div>
                        <div
                          className={`mt-2 text-[10px] font-mono ${
                            isUser ? "text-slate-400 text-right" : "text-slate-400"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                      <Sparkles size={16} />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-xs text-slate-600 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">
                        Thinking with {selectedModel}...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Starter Prompt Chips */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase shrink-0">
                  Quick Topics:
                </span>
                {STARTER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Box Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about scooter models, batteries, range, or RTO rules..."
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-2xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-slate-900/10 shrink-0"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
