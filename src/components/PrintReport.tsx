import { AnalysisResult, Concept } from "../types";
import { 
  Award, Check, X, FileText, Calendar, ShieldAlert, Layers, Activity, HelpCircle 
} from "lucide-react";

interface PrintReportProps {
  result: AnalysisResult | null;
  selectedConcept: Concept;
  onClose: () => void;
}

export default function PrintReport({ result, selectedConcept, onClose }: PrintReportProps) {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center print:p-0 print:bg-white print:relative print:overflow-visible animate-fade-in">
      
      {/* CONTROL ACTIONS PANEL - Hidden during printing */}
      <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden z-50">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/40 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Activity className="h-4 w-4" />
          Confirm & Print / Save PDF
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Close Preview
        </button>
      </div>

      {/* REPORT PAGE CONTAINER */}
      <div 
        id="print-report-container"
        className="bg-[#111114] text-slate-200 rounded-3xl p-8 max-w-[800px] w-full shadow-2xl border border-slate-800 font-sans print:bg-white print:text-slate-900 print:shadow-none print:border-none print:p-0 print:w-full print:rounded-none"
      >
        {/* FORMAL HEADER */}
        <div className="border-b-2 border-slate-850 print:border-slate-900 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-extrabold text-indigo-400 print:text-indigo-600 font-mono tracking-wider uppercase">Official Evaluation Dossier</span>
            <h1 className="text-2xl font-extrabold text-white print:text-slate-900 mt-1">VBCUA Academic Report</h1>
            <p className="text-xs text-slate-500 print:text-slate-400 font-mono mt-1">Voice-Based Concept Understanding Analyser</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-slate-500 print:text-slate-400 font-mono uppercase font-bold">Generated Timestamp</span>
            <span className="text-xs font-bold text-slate-300 print:text-slate-700 flex items-center gap-1 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {currentDate}
            </span>
          </div>
        </div>

        {/* METADATA SUMMARY BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0c0c0e]/60 border border-slate-800 rounded-2xl p-4 mb-6 print:bg-slate-50 print:border-slate-100">
          <div>
            <span className="text-[9px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Target Concept</span>
            <p className="text-xs font-extrabold text-white print:text-slate-800 truncate mt-0.5">{result.conceptName}</p>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Subject Area</span>
            <p className="text-xs font-bold text-slate-300 print:text-slate-600 truncate mt-0.5">{selectedConcept.category}</p>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Result Status</span>
            <p className="text-xs font-bold text-emerald-400 print:text-emerald-600 truncate mt-0.5 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              {result.understandingLevel}
            </p>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Delivery Mode</span>
            <p className="text-xs font-bold text-slate-300 print:text-slate-700 mt-0.5">Vocal / Auditory</p>
          </div>
        </div>

        {/* CORE SCORING DIAGRAMS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Comprehension */}
          <div className="border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center bg-[#0c0c0e]/30 print:border-slate-100 print:bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Comprehension Compliance</span>
            <div className="text-3xl font-extrabold text-white print:text-slate-900 my-2">{result.comprehensionScore}%</div>
            <p className="text-[11px] text-slate-400 print:text-slate-500 font-medium">Compliance against evaluation criteria</p>
          </div>

          {/* Semantic Similarity */}
          <div className="border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center bg-[#0c0c0e]/30 print:border-slate-100 print:bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Semantic Similarity</span>
            <div className="text-3xl font-extrabold text-white print:text-slate-900 my-2">{result.semanticSimilarity}%</div>
            <p className="text-[11px] text-slate-400 print:text-slate-500 font-medium">Embedding alignment against references</p>
          </div>

          {/* Speech Fluency */}
          <div className="border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center bg-[#0c0c0e]/30 print:border-slate-100 print:bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-500 print:text-slate-400 font-mono uppercase">Fluency Metrics</span>
            <div className="text-3xl font-extrabold text-white print:text-slate-900 my-2">
              {((1 - result.pauseRatio) * 100).toFixed(0)}%
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-500 font-medium">Pacing & articulation confidence</p>
          </div>
        </div>

        {/* CONCEPTUAL CHECKPOINTS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Covered */}
          <div className="border border-emerald-900/30 rounded-2xl p-4 bg-emerald-950/15 print:border-emerald-100 print:bg-emerald-50/20">
            <h4 className="text-xs font-bold text-emerald-400 print:text-emerald-800 font-mono uppercase flex items-center gap-1 mb-2.5">
              <Check className="h-4 w-4 text-emerald-400 print:text-emerald-600" />
              Addressed Conceptual Benchmarks
            </h4>
            <ul className="space-y-1.5">
              {result.pointsCovered.map((pt, i) => (
                <li key={i} className="text-xs font-medium text-slate-300 print:text-slate-700 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  <span>{pt}</span>
                </li>
              ))}
              {result.pointsCovered.length === 0 && (
                <li className="text-xs text-slate-500 print:text-slate-400 italic">No major points covered.</li>
              )}
            </ul>
          </div>

          {/* Missed */}
          <div className="border border-amber-900/30 rounded-2xl p-4 bg-amber-950/15 print:border-amber-100 print:bg-amber-50/20">
            <h4 className="text-xs font-bold text-amber-400 print:text-amber-800 font-mono uppercase flex items-center gap-1 mb-2.5">
              <X className="h-4 w-4 text-amber-500 print:text-amber-600" />
              Omitted Benchmarks / Concepts
            </h4>
            <ul className="space-y-1.5">
              {result.pointsMissed.map((pt, i) => (
                <li key={i} className="text-xs font-medium text-slate-300 print:text-slate-700 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                  <span>{pt}</span>
                </li>
              ))}
              {result.pointsMissed.length === 0 && (
                <li className="text-xs text-emerald-400 print:text-emerald-700 font-bold">All milestones covered.</li>
              )}
            </ul>
          </div>
        </div>

        {/* TRANSCRIPT ANALYSIS */}
        <div className="border border-slate-800 rounded-2xl p-4 mb-6 bg-[#0c0c0e]/30 print:border-slate-100 print:bg-slate-50/20">
          <h4 className="text-xs font-bold text-white print:text-slate-800 font-mono uppercase flex items-center gap-1.5 mb-2">
            <FileText className="h-4 w-4 text-indigo-400 print:text-indigo-500" />
            Transcribed Oral Response
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium bg-[#0c0c0e] p-3 border border-slate-850 rounded-xl print:bg-white print:text-slate-600 print:border-slate-100">
            {result.transcript}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-slate-500 print:text-slate-400 font-mono">DENSITY METRICS:</span>
            {result.fillerWords.map((f, i) => (
              <span key={i} className="text-[10px] font-bold font-mono bg-[#18181b] text-slate-350 border border-slate-800 px-2 py-0.5 rounded-md print:bg-slate-100 print:text-slate-600 print:border-slate-200/50">
                "{f.word}": {f.count} count
              </span>
            ))}
            {result.fillerWords.length === 0 && (
              <span className="text-[10px] font-bold font-mono bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded-md print:bg-emerald-50 print:text-emerald-700 print:border-none">
                No vocal fillers recorded
              </span>
            )}
          </div>
        </div>

        {/* REPORT SUMMARY FEEDBACK */}
        <div className="space-y-4 border-t border-slate-800 print:border-slate-100 pt-5">
          <div>
            <h4 className="text-xs font-bold text-slate-500 print:text-slate-400 font-mono uppercase tracking-wide mb-1">Qualitative Explanation Review</h4>
            <p className="text-xs text-slate-300 print:text-slate-600 leading-relaxed font-medium">
              {result.aiSummary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 print:text-slate-400 font-mono uppercase tracking-wide mb-1">Articulation & Delivery Analysis</h4>
            <p className="text-xs text-slate-300 print:text-slate-600 leading-relaxed font-medium">
              {result.deliveryFeedback}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 print:text-slate-400 font-mono uppercase tracking-wide mb-2.5">Academic Action Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.improvementTips.map((tip, i) => (
                <div key={i} className="p-3 bg-[#0c0c0e] border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-100">
                  <span className="text-[10px] font-bold font-mono text-indigo-400 print:text-indigo-500 block mb-0.5">RECOMMENDATION {i + 1}</span>
                  <p className="text-xs text-slate-300 print:text-slate-600 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FORMAL FOOTER */}
        <div className="border-t border-slate-800 print:border-slate-200 pt-4 mt-8 flex justify-between items-center text-[10px] text-slate-500 print:text-slate-400 font-mono">
          <span>VBCUA Evaluation Platform © 2026</span>
          <span>Security Status: Secure SSL Verified</span>
        </div>

      </div>
    </div>
  );
}
