import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mic, 
  Activity, 
  FileText, 
  Brain, 
  Sliders, 
  Sparkles, 
  LayoutDashboard, 
  ArrowRight, 
  ArrowDown, 
  Info 
} from "lucide-react";

interface SystemPipelineProps {
  currentStage: "idle" | "recording" | "evaluating" | "finished";
}

interface Step {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<any>;
  description: string;
  techStack: string;
}

export default function SystemPipeline({ currentStage }: SystemPipelineProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      label: "Student Role",
      sublabel: "Select & Prepare",
      icon: User,
      description: "The user selects an academic concept, reviews the rubrics, and triggers the audio input workflow.",
      techStack: "React UI Framework"
    },
    {
      id: 2,
      label: "Upload / Capture",
      sublabel: "Capture Audio Signal",
      icon: Mic,
      description: "Captures live narration via Web Audio API or accepts pre-recorded WAV/MP3 files from filesystem storage.",
      techStack: "HTML5 Web Audio / FileReader"
    },
    {
      id: 3,
      label: "Speech-to-Text",
      sublabel: "Audio Decoding",
      icon: Activity,
      description: "Converts oral waveform streams into high-fidelity text strings using Gemini transcription decoders.",
      techStack: "Gemini Whisper-grade ASR API"
    },
    {
      id: 4,
      label: "Transcript Engine",
      sublabel: "Lexical Processing",
      icon: FileText,
      description: "Prepares raw text corpora and flags speech hesitations, standard verbal fillers (um, uh), and pacing variations.",
      techStack: "RegEx Parsing & Tokenizer"
    },
    {
      id: 5,
      label: "Semantic Similarity",
      sublabel: "S-BERT Embeddings",
      icon: Brain,
      description: "Computes dense mathematical vector embeddings to compare user descriptions against reference textbooks.",
      techStack: "Gemini LLM Embeddings Engine"
    },
    {
      id: 6,
      label: "Acoustic Profiling",
      sublabel: "DSP Wave Analytics",
      icon: Sliders,
      description: "Applies digital signal processing to measure absolute amplitude variations, pause percentages, and speech density.",
      techStack: "DSP RMS & Amplitude Decibel Mapping"
    },
    {
      id: 7,
      label: "AI Scoring Engine",
      sublabel: "Rubric Grading",
      icon: Sparkles,
      description: "Aggregates linguistic similarity, acoustic traits, and key milestones to assign structured numerical mastery grades.",
      techStack: "Gemini Structured JSON Output Schema"
    },
    {
      id: 8,
      label: "Performance Report",
      sublabel: "Dashboard & PDF",
      icon: LayoutDashboard,
      description: "Renders responsive color-coded visualizers, radial score gauges, and formats official, print-ready academic PDFs.",
      techStack: "Tailwind CSS & Browser Print Engine"
    }
  ];

  // Map state to step activation
  const getStepStatus = (stepId: number) => {
    switch (currentStage) {
      case "idle":
        if (stepId === 1) return "active";
        return "pending";
      case "recording":
        if (stepId < 2) return "completed";
        if (stepId === 2) return "active";
        return "pending";
      case "evaluating":
        if (stepId < 3) return "completed";
        if (stepId >= 3 && stepId <= 7) return "active";
        return "pending";
      case "finished":
        return "completed";
      default:
        return "pending";
    }
  };

  return (
    <div className="bg-[#111114] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800/60 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
            System Processing Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time pipeline progression illustrating acoustic signal processing and semantic AI assessment.
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-400 font-mono px-2 py-1 rounded-md border border-indigo-500/20">
          <Info className="h-3 w-3 shrink-0" />
          <span>HOVER STEPS FOR TECHNICAL LOGIC</span>
        </div>
      </div>

      {/* PIPELINE STAGES FLOWCHART */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const status = getStepStatus(step.id);
          const StepIcon = step.icon;
          const isHovered = hoveredStep === step.id;

          // Compute style tokens based on active state
          let borderStyle = "border-slate-850 bg-[#0c0c0e]/30 text-slate-500";
          let iconStyle = "bg-slate-900/50 text-slate-500 border-slate-850";
          let badgeStyle = "bg-slate-900 text-slate-500 border-slate-850";

          if (status === "active") {
            borderStyle = "border-indigo-500/50 bg-indigo-500/5 text-indigo-100 shadow-lg shadow-indigo-950/20";
            iconStyle = "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 animate-pulse";
            badgeStyle = "bg-indigo-500 text-white border-transparent";
          } else if (status === "completed") {
            borderStyle = "border-emerald-500/30 bg-emerald-950/5 text-slate-300";
            iconStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            badgeStyle = "bg-emerald-500 text-white border-transparent";
          }

          return (
            <div
              key={step.id}
              className="relative"
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className={`p-3.5 rounded-2xl border ${borderStyle} transition-all duration-300 flex flex-col justify-between h-[105px] cursor-help hover:scale-[1.02]`}>
                
                {/* STEP UPPER STRIP */}
                <div className="flex justify-between items-start">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold shrink-0 ${badgeStyle}`}>
                    {step.id}
                  </div>
                  <div className={`p-1.5 rounded-lg border ${iconStyle} shrink-0`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* STEP DETAILS */}
                <div className="mt-2 text-left">
                  <p className="text-xs font-extrabold text-slate-200 tracking-tight leading-none truncate">
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wide truncate">
                    {step.sublabel}
                  </p>
                </div>

              </div>

              {/* CONNECTING ARROWS */}
              {step.id < 8 && (
                <>
                  {/* Desktop Right Connection Arrow */}
                  {step.id % 4 !== 0 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 items-center justify-center">
                      <ArrowRight className={`h-4.5 w-4.5 ${status === "completed" ? "text-emerald-500/60" : status === "active" ? "text-indigo-400 animate-pulse" : "text-slate-800"}`} />
                    </div>
                  )}
                  {/* Desktop Row Wrapping Arrow */}
                  {step.id === 4 && (
                    <div className="hidden md:flex absolute top-[105px] right-[40px] h-6 items-center justify-center z-10">
                      <ArrowDown className={`h-4.5 w-4.5 ${status === "completed" ? "text-emerald-500/60" : "text-slate-800"}`} />
                    </div>
                  )}
                  {/* Mobile Down Arrow for Grid items */}
                  <div className="md:hidden absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
                    {step.id % 2 === 0 ? (
                      <ArrowDown className={`h-3.5 w-3.5 ${status === "completed" ? "text-emerald-500/60" : "text-slate-800"}`} />
                    ) : (
                      <ArrowRight className={`h-3.5 w-3.5 ${status === "completed" ? "text-emerald-500/60" : "text-slate-800"}`} />
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* DETAILED TOOLTIP PREVIEW ZONE */}
      <div className="bg-[#0c0c0e]/60 border border-slate-850 rounded-2xl p-4 min-h-[90px] relative overflow-hidden transition-all duration-300">
        <AnimatePresence mode="wait">
          {hoveredStep !== null ? (
            <motion.div
              key={hoveredStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white font-mono uppercase tracking-wider">
                  Step {steps[hoveredStep - 1].id}: {steps[hoveredStep - 1].label}
                </span>
                <span className="text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {steps[hoveredStep - 1].techStack}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {steps[hoveredStep - 1].description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center text-center"
            >
              <p className="text-xs text-slate-500 italic max-w-[400px]">
                Hover over any pipeline milestone block above to examine the integrated technology execution stack and computational logic.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
