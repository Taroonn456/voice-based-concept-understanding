import { useState } from "react";
import { AnalysisResult, Concept } from "../types";
import { 
  Award, CheckCircle2, XCircle, FileText, BarChart3, TrendingUp, AlertTriangle, 
  Lightbulb, Printer, Sparkles, Volume2, Clock, ThumbsUp, ChevronRight
} from "lucide-react";
import AudioWaveform from "./AudioWaveform";

interface DashboardProps {
  result: AnalysisResult;
  selectedConcept: Concept;
  onPrint: () => void;
}

export default function Dashboard({ result, selectedConcept, onPrint }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"conceptual" | "delivery">("conceptual");

  // Highlight filler words inside the transcript
  const renderHighlightedTranscript = (text: string) => {
    if (!text) return null;
    const fillerWords = result.fillerWords.map(f => f.word.toLowerCase());
    
    if (fillerWords.length === 0) return <span>{text}</span>;

    // Pattern for matching filler words safely at boundaries
    const escapedFillers = fillerWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedFillers.join('|')})\\b`, 'gi');

    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (fillerWords.includes(part.toLowerCase())) {
        return (
          <span 
            key={i} 
            className="bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded mx-0.5 select-all text-xs inline-flex items-center animate-pulse"
            title="Spoken vocal filler detected"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Score colors for Dark Theme
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return { text: "text-emerald-400", border: "border-emerald-900/30", bg: "bg-emerald-950/25", fill: "stroke-emerald-450" };
    if (score >= 50) return { text: "text-amber-400", border: "border-amber-900/30", bg: "bg-amber-950/25", fill: "stroke-amber-450" };
    return { text: "text-red-400", border: "border-red-900/30", bg: "bg-red-950/25", fill: "stroke-red-450" };
  };

  const compStyles = getScoreColorClass(result.comprehensionScore);
  const simStyles = getScoreColorClass(result.semanticSimilarity);

  return (
    <div className="space-y-6">
      
      {/* OVERALL PERFORMANCE SUMMARY BAR */}
      <div className={`p-4 rounded-2xl border ${compStyles.border} ${compStyles.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800">
            <Award className={`h-6 w-6 ${compStyles.text}`} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Evaluation Result</span>
            <h2 className="font-extrabold text-white text-base flex items-center gap-1.5">
              <span>{result.understandingLevel}</span>
              <span className="text-xs font-mono font-bold bg-slate-900 px-2 py-0.5 rounded-full shadow-sm text-slate-350 border border-slate-800">
                Score: {result.comprehensionScore}/100
              </span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#18181b] hover:bg-[#202024] border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Export PDF Report
          </button>
        </div>
      </div>

      {/* THREE-COLUMN STATS GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* COMPREHENSION SCORE GAUGE */}
        <div className="bg-[#111114] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col items-center text-center">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">Comprehension Rubric</span>
          <div className="relative w-28 h-28 flex items-center justify-center my-2">
            {/* SVG circle gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgb(30, 41, 59)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                stroke={result.comprehensionScore >= 80 ? "rgb(16, 185, 129)" : result.comprehensionScore >= 50 ? "rgb(245, 158, 11)" : "rgb(239, 68, 68)"} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.comprehensionScore / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white">{result.comprehensionScore}%</span>
              <span className="text-[10px] text-slate-400 font-medium font-mono uppercase">Mastery</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-[180px] mt-2">
            Measures compliance with mandatory conceptual checkpoints.
          </p>
        </div>

        {/* SEMANTIC SIMILARITY GAUGE */}
        <div className="bg-[#111114] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col items-center text-center">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">Semantic Similarity</span>
          <div className="relative w-28 h-28 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgb(30, 41, 59)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                stroke={result.semanticSimilarity >= 80 ? "rgb(16, 185, 129)" : result.semanticSimilarity >= 50 ? "rgb(245, 158, 11)" : "rgb(239, 68, 68)"} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.semanticSimilarity / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white">{result.semanticSimilarity}%</span>
              <span className="text-[10px] text-slate-400 font-medium font-mono uppercase">Alignment</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-[180px] mt-2">
            Sentence-BERT embedding distance comparing standard definitions.
          </p>
        </div>

        {/* FLUENCY SCORE CARD */}
        <div className="bg-[#111114] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div className="text-center md:text-left mb-3">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Fluency Profiling</span>
            <p className="text-xs text-slate-500 mt-0.5">Summary of physical delivery metrics</p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#0c0c0e]/60 border border-slate-850">
              <span className="text-xs font-medium text-slate-450 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                Speech Length
              </span>
              <span className="text-xs font-bold text-white font-mono">{result.duration.toFixed(1)}s</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#0c0c0e]/60 border border-slate-850">
              <span className="text-xs font-medium text-slate-450 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Pause/Silence Ratio
              </span>
              <span className="text-xs font-bold text-white font-mono">{(result.pauseRatio * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#0c0c0e]/60 border border-slate-850">
              <span className="text-xs font-medium text-slate-450 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Vocal Hesitations
              </span>
              <span className="text-xs font-bold text-white font-mono">{result.totalPauses} pauses</span>
            </div>
          </div>
        </div>

      </div>

      {/* GRAPHICAL WAVEFORM & HESITATION TIMELINE */}
      <AudioWaveform 
        isRecording={false}
        rmsLevels={result.rmsLevels}
        pauseTimeline={result.pauseTimeline}
        duration={result.duration}
      />

      {/* MODULAR ASSESSMENT CATEGORIES - TAB SWITCH */}
      <div className="bg-[#111114] rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <div className="flex border-b border-slate-800 bg-[#0c0c0e]/60">
          <button
            onClick={() => setActiveTab("conceptual")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "conceptual"
                ? "border-indigo-500 text-indigo-450 bg-[#18181b]"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#18181b]/40"
            }`}
          >
            Conceptual Coverage Analysis
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "delivery"
                ? "border-indigo-500 text-indigo-450 bg-[#18181b]"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#18181b]/40"
            }`}
          >
            Speech Fluency & Delivery
          </button>
        </div>

        <div className="p-5">
          {activeTab === "conceptual" ? (
            <div className="space-y-5">
              {/* COVERED VS MISSED BENTO-GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* COVERED POINTS CHECKLIST */}
                <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-900/30 text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-3 font-mono uppercase tracking-wider">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-450 shrink-0" />
                    <span>Key Concepts Addressed ({result.pointsCovered.length})</span>
                  </div>
                  {result.pointsCovered.length > 0 ? (
                    <ul className="space-y-2">
                      {result.pointsCovered.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                          <ChevronRight className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No key conceptual benchmarks were addressed.</p>
                  )}
                </div>

                {/* MISSED POINTS CHECKLIST */}
                <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-900/30 text-slate-300">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-3 font-mono uppercase tracking-wider">
                    <XCircle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                    <span>Missed Benchmarks ({result.pointsMissed.length})</span>
                  </div>
                  {result.pointsMissed.length > 0 ? (
                    <ul className="space-y-2">
                      {result.pointsMissed.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                          <XCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-emerald-500" /> Perfect coverage! You addressed all major milestones.
                    </p>
                  )}
                </div>

              </div>

              {/* AI CONCEPTUAL SUMMARY */}
              <div className="bg-[#0c0c0e]/50 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                  <h4 className="font-bold text-xs text-white font-mono uppercase">AI Conceptual Review</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.aiSummary}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* SPEECH CLARITY & FILLER HIGHLIGHT CARD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="md:col-span-2 bg-[#0c0c0e]/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      <h4 className="font-bold text-xs text-white font-mono uppercase">Speech Transcript & Vocal Check</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {result.transcript.split(/\s+/).filter(Boolean).length} WORDS
                    </span>
                  </div>
                  
                  <div className="p-3 bg-[#0c0c0e] rounded-lg border border-slate-850 text-xs text-slate-300 leading-relaxed font-medium max-h-[140px] overflow-y-auto custom-scrollbar">
                    {renderHighlightedTranscript(result.transcript)}
                  </div>
                </div>

                <div className="bg-amber-950/10 border border-amber-900/20 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="h-4.5 w-4.5 text-amber-500" />
                    <h4 className="font-bold text-xs text-white font-mono uppercase">Filler Occurrences</h4>
                  </div>
                  
                  <div className="space-y-1.5 overflow-y-auto max-h-[110px] custom-scrollbar">
                    {result.fillerWords.length > 0 ? (
                      result.fillerWords.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-[#0c0c0e] py-1.5 px-2.5 rounded-lg border border-slate-850">
                          <span className="font-mono font-bold text-slate-300 bg-[#18181b] px-1.5 py-0.5 rounded border border-slate-800">"{item.word}"</span>
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded-full">{item.count} times</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-emerald-400 font-bold italic py-2">No standard filler expressions detected!</p>
                    )}
                  </div>
                </div>

              </div>

              {/* FLUENCY ANALYSIS REVIEW */}
              <div className="bg-[#0c0c0e]/50 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="h-4.5 w-4.5 text-indigo-400" />
                  <h4 className="font-bold text-xs text-white font-mono uppercase">Clarity & Confidence Feedback</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.deliveryFeedback}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ACTIONABLE IMPROVEMENT RECOMMENDATIONS */}
      <div className="bg-indigo-950/15 rounded-2xl border border-indigo-900/30 p-5 shadow-lg">
        <div className="flex items-center gap-2 text-indigo-400 mb-3.5">
          <Lightbulb className="h-5 w-5 text-indigo-400 animate-bounce" />
          <h3 className="font-bold text-sm">Actionable Action Plan (Tailored Improvement Tips)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.improvementTips.map((tip, idx) => (
            <div key={idx} className="bg-[#111114] border border-indigo-900/30 rounded-xl p-4 relative shadow-md hover:border-indigo-800 transition-all">
              <span className="absolute -top-3.5 left-4 text-xs font-extrabold bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#111114] font-mono">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
