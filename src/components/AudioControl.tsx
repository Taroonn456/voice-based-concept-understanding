import React, { useState, useRef, useEffect } from "react";
import { Concept, ClientAudioMetrics, PresetSample, AnalysisResult } from "../types";
import { PRESET_SAMPLES } from "../data/presets";
import { 
  Mic, Square, Upload, Sparkles, FileAudio, RefreshCw, AlertCircle, FileText, CheckCircle, Info
} from "lucide-react";

interface AudioControlProps {
  selectedConcept: Concept;
  onAnalysisStart: () => void;
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onAnalysisFailure: (error: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export default function AudioControl({
  selectedConcept,
  onAnalysisStart,
  onAnalysisSuccess,
  onAnalysisFailure,
  onRecordingStateChange,
}: AudioControlProps) {
  const [activeMode, setActiveMode] = useState<"record" | "upload" | "presets" | "text">("presets");
  const [isRecording, setIsRecording] = useState(false);

  // Trigger recording state callback
  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isRecording);
    }
  }, [isRecording, onRecordingStateChange]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_SAMPLES[0].id);
  const [textInput, setTextInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Web Audio Recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recordIntervalRef = useRef<any | null>(null);
  
  // Real-time calculation arrays
  const rmsLevelsRef = useRef<number[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const pauseTimelineRef = useRef<{ start: number; end: number; type: 'speech' | 'pause' }[]>([]);
  const lastActivityTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, []);

  const stopRecordingResources = () => {
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  };

  // Format recording time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start recording audio
  const handleStartRecording = async () => {
    try {
      setErrorMsg("");
      audioChunksRef.current = [];
      rmsLevelsRef.current = [];
      pauseTimelineRef.current = [];
      silenceStartRef.current = null;
      lastActivityTimeRef.current = 0;
      setRecordingSeconds(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Web Audio API for real-time analysis (oscilloscope and metrics)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 254;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      // Start MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await processRecordedAudio();
      };

      mediaRecorder.start(250); // Get chunks every 250ms
      setIsRecording(true);

      // Track seconds and dynamic volume level
      const startTime = Date.now();
      lastActivityTimeRef.current = startTime;

      recordIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);

        // Analyze volume
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Calculate Root Mean Square (RMS) level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / bufferLength);
        rmsLevelsRef.current.push(rms);

        // Pause/Hesitation detection (RMS < 0.015 for over 500ms is considered a pause)
        const currentTime = (Date.now() - startTime) / 1000;
        const isSilent = rms < 0.015;

        if (isSilent) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = currentTime;
          }
        } else {
          if (silenceStartRef.current !== null) {
            const pauseDur = currentTime - silenceStartRef.current;
            if (pauseDur >= 0.5) {
              // Valid pause segment
              pauseTimelineRef.current.push({
                start: silenceStartRef.current,
                end: currentTime,
                type: "pause",
              });
            }
            silenceStartRef.current = null;
          }
        }
      }, 1000);

    } catch (err: any) {
      console.error("Mic Access Error:", err);
      setErrorMsg(
        "Unable to access microphone. Since this app runs inside a sandboxed preview iframe, your browser blocks microphone capture. Please click 'Open in New Tab' (or 'Open App') at the top right of the preview workspace to record, or use the 'Upload Audio' or 'Demo Presets' tabs!"
      );
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopRecordingResources();
    }
  };

  // Process completed recording
  const processRecordedAudio = async () => {
    setIsProcessing(true);
    onAnalysisStart();

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const duration = recordingSeconds || 5;

      // Close open pause segment if recording stopped in silence
      if (silenceStartRef.current !== null) {
        const pauseDur = duration - silenceStartRef.current;
        if (pauseDur >= 0.5) {
          pauseTimelineRef.current.push({
            start: silenceStartRef.current,
            end: duration,
            type: "pause",
          });
        }
      }

      // Fill in active speech intervals in timeline
      const timelineWithSpeech = fillSpeechSegments(pauseTimelineRef.current, duration);

      // Convert audio file to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        // Perform server analysis
        await submitToBackend(base64Audio, duration, rmsLevelsRef.current, timelineWithSpeech);
      };
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to process recorded audio stream.");
      onAnalysisFailure("Audio processing failed.");
      setIsProcessing(false);
    }
  };

  // Re-fill pauses to mark the spaces between pauses as "speech"
  const fillSpeechSegments = (
    pauses: { start: number; end: number; type: 'speech' | 'pause' }[], 
    duration: number
  ) => {
    const timeline: { start: number; end: number; type: 'speech' | 'pause' }[] = [];
    
    // Sort pauses by start time
    const sortedPauses = [...pauses].sort((a, b) => a.start - b.start);
    
    let lastTime = 0;
    sortedPauses.forEach((p) => {
      if (p.start > lastTime + 0.1) {
        timeline.push({ start: lastTime, end: p.start, type: "speech" });
      }
      timeline.push(p);
      lastTime = p.end;
    });

    if (lastTime < duration) {
      timeline.push({ start: lastTime, end: duration, type: "speech" });
    }

    return timeline;
  };

  // Audio upload processing
  const handleUploadedFile = (file: File) => {
    setErrorMsg("");
    if (!file.type.startsWith("audio/") && !file.name.endsWith(".mp3") && !file.name.endsWith(".wav") && !file.name.endsWith(".m4a") && !file.name.endsWith(".webm") && !file.name.endsWith(".ogg")) {
      setErrorMsg("Please upload a valid audio file (.mp3, .wav, .m4a, .webm, etc.)");
      return;
    }
    setUploadedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadedFile(file);
    }
  };

  const handleProcessUploadedFile = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    onAnalysisStart();

    try {
      // Decompress uploaded audio using browser AudioContext to get exact duration & amplitude waves
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const duration = audioBuffer.duration;
      const channelData = audioBuffer.getChannelData(0); // Left channel

      // Produce 40 sample points
      const numSamples = 40;
      const sampleSize = Math.floor(channelData.length / numSamples);
      const rmsLevels: number[] = [];
      const pauses: { start: number; end: number; type: 'speech' | 'pause' }[] = [];

      let silenceStart: number | null = null;

      for (let i = 0; i < numSamples; i++) {
        const start = i * sampleSize;
        const end = start + sampleSize;
        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sum / sampleSize);
        rmsLevels.push(rms);

        // Pause tracking (rms below 0.015)
        const currentTime = (i / numSamples) * duration;
        const isSilent = rms < 0.015;

        if (isSilent) {
          if (silenceStart === null) silenceStart = currentTime;
        } else {
          if (silenceStart !== null) {
            const pauseDur = currentTime - silenceStart;
            if (pauseDur >= 0.5) {
              pauses.push({ start: silenceStart, end: currentTime, type: "pause" });
            }
            silenceStart = null;
          }
        }
      }

      if (silenceStart !== null) {
        const pauseDur = duration - silenceStart;
        if (pauseDur >= 0.5) {
          pauses.push({ start: silenceStart, end: duration, type: "pause" });
        }
      }

      const timeline = fillSpeechSegments(pauses, duration);

      // Normalize rms values to [0.01 - 0.25] to render beautifully
      const maxRms = Math.max(...rmsLevels, 0.01);
      const normalizedRms = rmsLevels.map((r) => Math.max(0.01, (r / maxRms) * 0.22));

      // Convert audio file to Base64 to upload to Gemini API
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        await submitToBackend(base64Audio, duration, normalizedRms, timeline);
      };

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to decode and parse audio file. The file format may be unsupported by the browser.");
      onAnalysisFailure("Audio decoding failed.");
      setIsProcessing(false);
    }
  };

  // Submit to Node/Express backend which communicates with Gemini API
  const submitToBackend = async (
    base64Audio: string,
    duration: number,
    rmsLevels: number[],
    timeline: { start: number; end: number; type: 'speech' | 'pause' }[]
  ) => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: base64Audio,
          conceptName: selectedConcept.name,
          referenceText: selectedConcept.referenceText,
          keyPoints: selectedConcept.keyPoints,
          isAudio: true
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis failed.");
      }

      const data = await response.json();

      // Combine client-side DSP audio metrics with Gemini evaluation results
      const totalPauses = timeline.filter((t) => t.type === "pause").length;
      const pauseDuration = timeline
        .filter((t) => t.type === "pause")
        .reduce((sum, current) => sum + (current.end - current.start), 0);
      const pauseRatio = duration > 0 ? pauseDuration / duration : 0;
      const avgVolume = rmsLevels.reduce((a, b) => a + b, 0) / rmsLevels.length;

      const finalResult: AnalysisResult = {
        ...data,
        duration,
        pauseRatio,
        totalPauses,
        averageVolume: avgVolume,
        rmsLevels,
        pauseTimeline: timeline,
      };

      onAnalysisSuccess(finalResult);
    } catch (err: any) {
      console.error("Backend Submission Error:", err);
      setErrorMsg(err.message || "Communication error with Gemini assessment server.");
      onAnalysisFailure(err.message || "Server communication failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Process text-only fallback input
  const handleProcessTextInput = async () => {
    if (!textInput.trim()) {
      setErrorMsg("Please type out your explanation first.");
      return;
    }
    setIsProcessing(true);
    onAnalysisStart();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptName: selectedConcept.name,
          referenceText: selectedConcept.referenceText,
          keyPoints: selectedConcept.keyPoints,
          textFallback: textInput,
          isAudio: false
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Text analysis failed.");
      }

      const data = await response.json();

      // Create dummy audio metrics for text fallback
      const duration = textInput.split(/\s+/).length * 0.45; // Estimate 130 WPM
      const finalResult: AnalysisResult = {
        ...data,
        duration: duration,
        pauseRatio: 0.05,
        totalPauses: 1,
        averageVolume: 0.15,
        rmsLevels: Array.from({ length: 30 }, () => 0.1 + Math.random() * 0.12),
        pauseTimeline: [
          { start: 0, end: duration - 1, type: "speech" },
          { start: duration - 1, end: duration, type: "pause" },
        ],
      };

      onAnalysisSuccess(finalResult);
    } catch (err: any) {
      console.error("Text Submission Error:", err);
      setErrorMsg(err.message || "An error occurred during text assessment.");
      onAnalysisFailure(err.message || "Text evaluation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger selected simulated preset evaluation (Scenarios 1, 2, 3)
  const handleSelectPreset = () => {
    setIsProcessing(true);
    onAnalysisStart();

    // Small timeout to simulate evaluation delay
    setTimeout(() => {
      const preset = PRESET_SAMPLES.find((p) => p.id === selectedPresetId);
      if (preset) {
        const result: AnalysisResult = {
          transcript: preset.transcript,
          conceptName: selectedConcept.name, // Bind to currently selected concept or preset's concept
          comprehensionScore: preset.comprehensionScore,
          semanticSimilarity: preset.semanticSimilarity,
          understandingLevel: preset.understandingLevel,
          pointsCovered: preset.pointsCovered,
          pointsMissed: preset.pointsMissed,
          aiSummary: preset.aiSummary,
          fillerWords: preset.fillerWords,
          deliveryFeedback: preset.deliveryFeedback,
          improvementTips: preset.improvementTips,
          duration: preset.duration,
          pauseRatio: preset.pauseRatio,
          totalPauses: preset.totalPauses,
          averageVolume: preset.averageVolume,
          rmsLevels: preset.rmsLevels,
          pauseTimeline: preset.pauseTimeline,
        };
        onAnalysisSuccess(result);
      } else {
        onAnalysisFailure("Preset not found.");
      }
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="bg-[#111114] rounded-2xl border border-slate-800 p-5 shadow-lg h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 mb-5 gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Interactive Evaluation Hub</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Select a submission method to evaluate your conceptual grasp</p>
          </div>
          <div className="grid grid-cols-2 md:flex bg-[#0c0c0e] p-1 rounded-xl text-xs font-semibold text-slate-400 border border-slate-850 gap-1 shrink-0">
            <button
              onClick={() => { setActiveMode("presets"); setErrorMsg(""); }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === "presets" 
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#18181b]/40 border border-transparent"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Demo Presets</span>
            </button>
            <button
              onClick={() => { setActiveMode("record"); setErrorMsg(""); }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === "record" 
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#18181b]/40 border border-transparent"
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Record Voice</span>
            </button>
            <button
              onClick={() => { setActiveMode("upload"); setErrorMsg(""); }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === "upload" 
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#18181b]/40 border border-transparent"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Audio</span>
            </button>
            <button
              onClick={() => { setActiveMode("text"); setErrorMsg(""); }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === "text" 
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#18181b]/40 border border-transparent"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Typed Text</span>
            </button>
          </div>
        </div>

        {/* MODE: PRESET SIMULATIONS */}
        {activeMode === "presets" && (
          <div className="space-y-4">
            <div className="p-3.5 bg-indigo-950/10 border border-indigo-900/30 rounded-xl">
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore the platform’s **Acoustic Profiling**, **Hesitation Mapping**, and **Gemini Evaluation** capabilities using pre-recorded scenarios. This demonstrates precise grading feedback and graphical widgets immediately.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 font-mono uppercase">Select Scenario Demo</label>
              <div className="space-y-2">
                {PRESET_SAMPLES.map((preset) => (
                  <label
                    key={preset.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPresetId === preset.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 hover:bg-slate-900/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preset_select"
                      value={preset.id}
                      checked={selectedPresetId === preset.id}
                      onChange={() => setSelectedPresetId(preset.id)}
                      className="mt-1 text-indigo-500 focus:ring-indigo-500 bg-slate-950 border-slate-800"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{preset.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{preset.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE: LIVE RECORDING */}
        {activeMode === "record" && (
          <div className="space-y-4 flex flex-col items-center py-4">
            {!isRecording ? (
              <div className="text-center space-y-4 w-full">
                <div className="flex justify-center">
                  <button
                    onClick={handleStartRecording}
                    disabled={isProcessing}
                    className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-950/40 hover:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    <Mic className="h-7 w-7" />
                  </button>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">Ready to Record</h4>
                  <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
                    Explain the concept **{selectedConcept.name}** clearly. Press the button to start recording.
                  </p>
                </div>

                {/* Microphone access helper tip for iframe environments */}
                <div className="mt-4 p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-left max-w-[340px] mx-auto space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 font-mono">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Microphone Sandboxing Tip</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Browsers block microphone requests inside sandboxed preview iframes. To record live voice, click the <span className="font-bold text-white">"Open in New Tab"</span> / <span className="font-bold text-white">"Open App"</span> icon at the top right of the workspace.
                  </p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Alternatively, try the <span className="font-semibold text-slate-200">"Upload Audio"</span> tab (to upload pre-recorded files) or run instant analysis on our <span className="font-semibold text-slate-200">"Demo Presets"</span> scenarios!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 w-full">
                <div className="flex justify-center">
                  <button
                    onClick={handleStopRecording}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-500/20 transition-all duration-300 animate-pulse cursor-pointer"
                  >
                    <Square className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold font-mono text-red-500 tracking-wider">
                    {formatTime(recordingSeconds)}
                  </div>
                  <p className="text-xs text-red-400 font-medium">Recording explanation dynamically...</p>
                </div>
              </div>
            )}
          </div>
        )}        {/* MODE: AUDIO UPLOAD */}
        {activeMode === "upload" && (
          <div className="space-y-4">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  handleUploadedFile(file);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center relative transition-all duration-300 ${
                isDragOver 
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-lg shadow-indigo-950/30" 
                  : "border-slate-800 hover:border-slate-700 bg-[#0c0c0e]/60"
              }`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className={`h-8 w-8 mx-auto mb-2 transition-all ${isDragOver ? "text-indigo-400 scale-110" : "text-slate-500"}`} />
              <p className="text-xs font-bold text-slate-200">Drag & drop your voice recording, or click to browse</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Supports MP3, WAV, M4A, WEBM files (Max 40MB)</p>
            </div>
 
            {uploadedFile && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#18181b] border border-slate-800 rounded-xl">
                  <FileAudio className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-white truncate">{uploadedFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-[10px] text-red-400 hover:underline font-bold cursor-pointer shrink-0"
                  >
                    Remove File
                  </button>
                </div>

                {/* VERIFY AUDIO PLAYBACK */}
                <div className="bg-[#0c0c0e]/50 border border-slate-850 rounded-xl p-3.5 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                      Verify Audio Playback
                    </span>
                    <span className="text-[9px] text-indigo-400 font-bold font-mono">
                      Decoder Status: READY
                    </span>
                  </div>
                  <audio 
                    src={URL.createObjectURL(uploadedFile)} 
                    controls 
                    className="w-full h-8 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE: TEXT MANUAL FALLBACK */}
        {activeMode === "text" && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 font-mono uppercase">Write explanation fallback</label>
            <textarea
              rows={4}
              placeholder={`Write down your detailed explanation for "${selectedConcept.name}" here...`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3 border border-slate-800 bg-[#0c0c0e] text-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none placeholder:text-slate-600"
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              *Note: Fluent-related acoustic parameters (RMS volume curves, pause timelines) will be estimated for testing, but full Semantic Alignment checks are fully active.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-start gap-1.5 p-3 rounded-xl bg-red-950/20 text-red-400 text-xs border border-red-900/40">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-4 border-t border-slate-800 mt-6">
        {activeMode === "presets" && (
          <button
            onClick={handleSelectPreset}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-950/40 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Analyzing Demo Benchmark...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Evaluate Demo Scenario
              </>
            )}
          </button>
        )}

        {activeMode === "upload" && (
          <button
            onClick={handleProcessUploadedFile}
            disabled={isProcessing || !uploadedFile}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-950/40 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Transcribing & Evaluating Audio...
              </>
            ) : (
              <>
                <FileAudio className="h-3.5 w-3.5" />
                Analyze Uploaded Audio
              </>
            )}
          </button>
        )}

        {activeMode === "text" && (
          <button
            onClick={handleProcessTextInput}
            disabled={isProcessing || !textInput.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-950/40 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Assessing Written Concept...
              </>
            ) : (
              <>
                <FileText className="h-3.5 w-3.5" />
                Analyze Written Text
              </>
            )}
          </button>
        )}

        {activeMode === "record" && isRecording && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-400 bg-red-950/20 py-2 rounded-xl border border-red-900/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Speak clearly... Press Stop when finished.
          </div>
        )}

        {activeMode === "record" && !isRecording && isProcessing && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/20 py-2.5 rounded-xl border border-indigo-900/40">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Generating AI Diagnostics...
          </div>
        )}
      </div>
    </div>
  );
}
