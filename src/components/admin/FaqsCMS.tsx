/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { HelpCircle, Plus, Trash2, Edit3, Save, X, Sparkles } from "lucide-react";
import { useSiteConfig } from "../../SiteConfigContext";
import { FAQItem } from "../../data";

interface FaqsCMSProps {
  onShowToast: (msg: string) => void;
}

export default function FaqsCMS({ onShowToast }: FaqsCMSProps) {
  const { faqsData, addFaq, deleteFaq, updateSingleFaq, siteSections, updateSiteSections } = useSiteConfig();

  const [sectionsForm, setSectionsForm] = useState(siteSections);

  useEffect(() => {
    setSectionsForm(siteSections);
  }, [siteSections]);

  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyItem: FAQItem = {
    id: Date.now(),
    category: "General Inquiry",
    question: "",
    answer: "",
    iconName: "Shield",
  };

  const handleSave = (itemToSave: FAQItem) => {
    if (!itemToSave.question.trim() || !itemToSave.answer.trim()) {
      alert("Please provide both a question and answer.");
      return;
    }

    if (isAdding) {
      addFaq(itemToSave);
      onShowToast("New FAQ added!");
      setIsAdding(false);
    } else {
      updateSingleFaq(itemToSave.id, itemToSave);
      onShowToast("FAQ updated!");
    }
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this FAQ entry?")) {
      deleteFaq(id);
      onShowToast("FAQ removed.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
            <HelpCircle size={18} className="text-orange-400" />
            Frequently Asked Queries (FAQs) CMS
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize all questions, answers, and regulatory guidance displayed in the Support Headquarters section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem({ ...emptyItem, id: Date.now() });
            setIsAdding(true);
          }}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
        >
          <Plus size={15} />
          Add Question
        </button>
      </div>

      {/* Section Titles & Badges Configuration */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-orange-400" />
            Support Headquarters &amp; FAQ Section Headlines
          </h4>
          <button
            type="button"
            onClick={() => {
              updateSiteSections(sectionsForm);
              onShowToast("FAQ section headings saved!");
            }}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Save size={12} />
            Save Headings
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Top Pill Badge
            </label>
            <input
              type="text"
              value={sectionsForm.faqBadge}
              onChange={(e) => setSectionsForm({ ...sectionsForm, faqBadge: e.target.value })}
              placeholder="Support Headquarters"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Main Section Heading
            </label>
            <input
              type="text"
              value={sectionsForm.faqHeading}
              onChange={(e) => setSectionsForm({ ...sectionsForm, faqHeading: e.target.value })}
              placeholder="Frequently Asked Queries"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Subtitle Paragraph
          </label>
          <textarea
            rows={2}
            value={sectionsForm.faqSubtitle}
            onChange={(e) => setSectionsForm({ ...sectionsForm, faqSubtitle: e.target.value })}
            placeholder="Find prompt, comprehensive answers to regulatory compliance..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
          />
        </div>
      </div>

      {/* Editor Modal / Inline form */}
      {(editingItem !== null || isAdding) && (
        <div className="bg-slate-950 border border-orange-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={16} className="text-orange-400" />
              {isAdding ? "Create New FAQ Query" : `Edit FAQ`}
            </h4>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAdding(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="e.g. Legal & RTO Exemption"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Icon Style
                  </label>
                  <select
                    value={editingItem.iconName}
                    onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value="Shield">🛡️ Shield (Legal / Protection)</option>
                    <option value="Battery">🔋 Battery (Power / Charging)</option>
                    <option value="Wrench">🔧 Wrench (Service / Maintenance)</option>
                    <option value="Award">🏆 Award (Warranty / Quality)</option>
                    <option value="Zap">⚡ Zap (Electrical / Motor)</option>
                    <option value="Activity">📈 Activity (Technology / Controller)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Question
                </label>
                <input
                  type="text"
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  placeholder="Do I really not need a driving license or RTO registration?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Detailed Answer
                </label>
                <textarea
                  rows={4}
                  value={editingItem.answer}
                  onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                  placeholder="Explain clearly with regulatory citations or maintenance advice..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAdding(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(editingItem)}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Save size={14} />
                  Save FAQ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ items list */}
      <div className="space-y-3">
        {faqsData.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 relative group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-orange-400 uppercase font-bold tracking-wider">
                  {item.category}
                </span>
                <h4 className="font-bold text-sm text-white mt-1">{item.question}</h4>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsAdding(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
