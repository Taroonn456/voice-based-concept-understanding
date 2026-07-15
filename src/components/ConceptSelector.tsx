import React, { useState } from "react";
import { Concept } from "../types";
import { PREDEFINED_CONCEPTS } from "../data/concepts";
import { Search, Plus, CheckCircle2, Award, BookOpen, AlertCircle } from "lucide-react";

interface ConceptSelectorProps {
  selectedConcept: Concept;
  onSelectConcept: (concept: Concept) => void;
  customConcepts: Concept[];
  onAddCustomConcept: (concept: Concept) => void;
}

export default function ConceptSelector({
  selectedConcept,
  onSelectConcept,
  customConcepts,
  onAddCustomConcept,
}: ConceptSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Form states for adding custom concepts
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customRefText, setCustomRefText] = useState("");
  const [customKeyPointsText, setCustomKeyPointsText] = useState("");
  const [formError, setFormError] = useState("");

  const allConcepts = [...PREDEFINED_CONCEPTS, ...customConcepts];

  // Unique categories for filtering
  const categories = ["All", ...Array.from(new Set(allConcepts.map((c) => c.category)))];

  const filteredConcepts = allConcepts.filter((concept) => {
    const matchesSearch =
      concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCustomConcept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCategory || !customRefText || !customKeyPointsText) {
      setFormError("Please fill out all required fields.");
      return;
    }

    const parsedPoints = customKeyPointsText
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (parsedPoints.length < 2) {
      setFormError("Please provide at least 2 key points for evaluation (one per line).");
      return;
    }

    const newConcept: Concept = {
      id: `custom_${Date.now()}`,
      name: customName,
      category: customCategory,
      description: customDesc || `User-defined concept evaluation criteria for ${customName}.`,
      referenceText: customRefText,
      keyPoints: parsedPoints,
    };

    onAddCustomConcept(newConcept);
    onSelectConcept(newConcept);

    // Reset form states
    setCustomName("");
    setCustomCategory("");
    setCustomDesc("");
    setCustomRefText("");
    setCustomKeyPointsText("");
    setFormError("");
    setShowCustomModal(false);
  };

  return (
    <div className="bg-[#111114] rounded-2xl border border-slate-800 p-5 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          <h2 className="font-bold text-white text-base">Select Reference Concept</h2>
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Custom Concept
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-800 bg-[#0c0c0e] rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-2.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-[#18181b] text-slate-400 hover:bg-[#202024] hover:text-slate-300 border border-slate-800/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Grid/Scroll List */}
      <div className="grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[220px] flex-1 pr-1 custom-scrollbar">
        {filteredConcepts.map((concept) => {
          const isSelected = concept.id === selectedConcept.id;
          return (
            <button
              key={concept.id}
              onClick={() => onSelectConcept(concept)}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "border-slate-800/80 hover:border-slate-700/85 bg-[#0c0c0e]/40 hover:bg-[#18181b]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {concept.category}
                </span>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
              </div>
              <h4 className="font-bold text-sm text-white mt-1.5">{concept.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-1">{concept.description}</p>
            </button>
          );
        })}
        {filteredConcepts.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs">No concepts matched your search.</div>
        )}
      </div>

      {/* Selected Concept Preview Section */}
      <div className="border border-slate-800 pt-4 mt-4 bg-[#18181b]/50 rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-slate-300 mb-2">
          <Award className="h-4 w-4 text-indigo-400" />
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider">Evaluation Benchmarks</h3>
        </div>
        <div className="space-y-2.5">
          <div>
            <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Reference Definition:</span>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mt-0.5">
              {selectedConcept.referenceText}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Target Key Points to hit:</span>
            <ul className="mt-1 space-y-1">
              {selectedConcept.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-1.5 text-xs text-slate-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Custom Concept Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#111114] rounded-2xl border border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-scale-up max-h-[90vh] overflow-y-auto text-slate-200">
            <h3 className="font-bold text-white text-lg mb-2">Create Custom Benchmarks</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add your own custom conceptual benchmark. The Gemini evaluation engine will analyze voice explanations against this exact standard.
            </p>

            <form onSubmit={handleCreateCustomConcept} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 font-mono uppercase">
                    Concept Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., REST API"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 bg-[#0c0c0e] text-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 font-mono uppercase">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Web Development"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 bg-[#0c0c0e] text-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 font-mono uppercase">Brief Description</label>
                <input
                  type="text"
                  placeholder="e.g., An architectural style for API designs."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 bg-[#0c0c0e] text-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 font-mono uppercase">
                  Reference Standard Definition <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Paste or write the complete, correct conceptual explanation. The AI uses this for semantic comparison."
                  value={customRefText}
                  onChange={(e) => setCustomRefText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 bg-[#0c0c0e] text-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 font-mono uppercase">
                  Key Evaluation Rubrics (One per line, min 2) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter key concepts the explainer MUST cover.
e.g.:
Uses standard HTTP verbs (GET, POST)
State is stateless between calls
Data is formatted as JSON or XML"
                  value={customKeyPointsText}
                  onChange={(e) => setCustomKeyPointsText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 bg-[#0c0c0e] text-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none font-mono placeholder:text-slate-600"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 p-2.5 rounded-lg border border-red-900/40">
                  <AlertCircle className="h-4 w-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setFormError("");
                    setShowCustomModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-950/40 transition-colors cursor-pointer"
                >
                  Save Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
