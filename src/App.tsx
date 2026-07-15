import { useState } from "react";
import { Concept, AnalysisResult } from "./types";
import { PREDEFINED_CONCEPTS } from "./data/concepts";
import ConceptSelector from "./components/ConceptSelector";
import AudioControl from "./components/AudioControl";
import Dashboard from "./components/Dashboard";
import PrintReport from "./components/PrintReport";
import SystemPipeline from "./components/SystemPipeline";
import { 
  Sparkles, Layers, BookOpen, Volume2, Award, ClipboardCheck, Play, ArrowRight, HelpCircle
} from "lucide-react";

export default function App() {
  const [selectedConcept, setSelectedConcept] = useState<Concept>(PREDEFINED_CONCEPTS[0]);
  const [customConcepts, setCustomConcepts] = useState<Concept[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<AnalysisResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const handleSelectConcept = (concept: Concept) => {
    setSelectedConcept(concept);
    // Reset previous evaluation results when changing concepts to prevent confusion
    setEvaluationResult(null);
  };

  const handleAddCustomConcept = (concept: Concept) => {
    setCustomConcepts((prev) => [concept, ...prev]);
  };

  // Derive stage for the processing pipeline visualizer
  const getPipelineStage = (): "idle" | "recording" | "evaluating" | "finished" => {
    if (isRecording) return "recording";
    if (isEvaluating) return "evaluating";
    if (evaluationResult) return "finished";
    return "idle";
  };

  const pipelineStage = getPipelineStage();

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 antialiased font-sans flex flex-col">
      
      {/* HEADER SECTION */}
      <header className="bg-[#0c0c0e] border-b border-slate-800 py-5 px-6 sticky top-0 z-30 shadow-md shadow-black/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-950/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-lg tracking-tight">
                Voice-Based Concept Understanding Analyser
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Evaluate explanation clarity, semantic S-BERT similarity, and spoken fluency with Gemini AI diagnostics.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>PLATFORM STATUS: SECURE DEPLOYMENT</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* LANDING SPLASH INFO CARD */}
        {!evaluationResult && !isEvaluating && (
          <div className="bg-[#111114] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold font-mono border border-indigo-500/20">
                <Sparkles className="h-3 w-3" /> INTRODUCING VBCUA V1.0
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Evaluate how effectively you explain academic and technical topics.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect your microphone or upload an audio file. The application uses digital signal processing (DSP) to calculate pause patterns and RMS volumes, while Gemini AI transcribes and scores your semantic coverage against core scientific benchmarks.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span>5+ Core Standards</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800">
                  <Volume2 className="h-4 w-4 text-indigo-400" />
                  <span>Acoustic Wave Profiling</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-800">
                  <Award className="h-4 w-4 text-indigo-400" />
                  <span>PDF Reporting Enabled</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-gradient-to-tr from-slate-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-sm tracking-wide uppercase font-mono text-indigo-400">Step-by-Step Guide</h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-white">1</span>
                  <p className="text-slate-300 leading-normal">
                    Select a conceptual benchmark on the left or create your own custom rubrics.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-white">2</span>
                  <p className="text-slate-300 leading-normal">
                    Record your explanation aloud, upload a pre-recorded file, or test using instant simulated pre-sets.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-white">3</span>
                  <p className="text-slate-300 leading-normal">
                    Review circular coverage scores, highlighted vocal fillers, hesitation mapping, and download formal PDF portfolios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC PIPELINE ARCHITECTURE TRACK */}
        <SystemPipeline currentStage={pipelineStage} />

        {/* WORKSPACE BENTO-GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* CONCEPT SELECTION SIDEBAR (Column Span: 5) */}
          <div className="lg:col-span-5 h-full">
            <ConceptSelector 
              selectedConcept={selectedConcept}
              onSelectConcept={handleSelectConcept}
              customConcepts={customConcepts}
              onAddCustomConcept={handleAddCustomConcept}
            />
          </div>

          {/* AUDIO RECORD/UPLOAD INTERACTIVE HUB (Column Span: 7) */}
          <div className="lg:col-span-7 h-full">
            <AudioControl 
              selectedConcept={selectedConcept}
              onAnalysisStart={() => {
                setIsEvaluating(true);
                setEvaluationResult(null);
              }}
              onAnalysisSuccess={(result) => {
                setEvaluationResult(result);
                setIsEvaluating(false);
              }}
              onAnalysisFailure={(err) => {
                setIsEvaluating(false);
              }}
              onRecordingStateChange={setIsRecording}
            />
          </div>

        </div>

        {/* LOADING STATE DIAGNOSTICS */}
        {isEvaluating && (
          <div className="bg-[#111114] border border-slate-800 rounded-3xl p-12 text-center shadow-lg space-y-4 animate-pulse">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-900/30 border-t-indigo-500 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Processing Diagnostics</h3>
              <p className="text-xs text-slate-400 max-w-[340px] mx-auto leading-relaxed">
                Gemini is transcribing oral waveforms and executing Sentence-BERT comparison checks against reference benchmarks...
              </p>
            </div>
          </div>
        )}

        {/* COMPREHENSIVE DIAGNOSTIC DASHBOARD */}
        {evaluationResult && !isEvaluating && (
          <div className="animate-fade-in">
            <Dashboard 
              result={evaluationResult} 
              selectedConcept={selectedConcept}
              onPrint={() => setShowPrintPreview(true)}
            />
          </div>
        )}

      </main>

      {/* PRINT REPORT PREVIEW SHEET / MODAL */}
      {showPrintPreview && evaluationResult && (
        <PrintReport 
          result={evaluationResult}
          selectedConcept={selectedConcept}
          onClose={() => setShowPrintPreview(false)}
        />
      )}

      {/* COMPACT FOOTER */}
      <footer className="bg-[#0c0c0e] border-t border-slate-800/80 mt-12 py-5 text-center text-xs text-slate-500 font-medium">
        <p>Voice-Based Concept Understanding Analyser (VBCUA) • Powered by Gemini AI Server-Side Integration</p>
      </footer>

    </div>
  );
}
