import { useEffect, useRef, useState } from "react";
import { Activity, Volume2 } from "lucide-react";

interface AudioWaveformProps {
  isRecording: boolean;
  audioContext?: AudioContext | null;
  analyserNode?: AnalyserNode | null;
  rmsLevels?: number[];
  pauseTimeline?: { start: number; end: number; type: "speech" | "pause" }[];
  duration?: number;
}

export default function AudioWaveform({
  isRecording,
  audioContext,
  analyserNode,
  rmsLevels = [],
  pauseTimeline = [],
  duration = 0,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<"waveform" | "timeline">("waveform");

  // Real-time canvas oscilloscope for recording state
  useEffect(() => {
    if (!isRecording || !analyserNode || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyserNode.getByteTimeDomainData(dataArray);

      // Dynamic scaling for responsiveness
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "rgb(12, 12, 14)"; // #0c0c0e
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = "rgba(51, 65, 85, 0.15)"; // slate-700/15
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Audio waveform line
      ctx.strokeStyle = "rgb(99, 102, 241)"; // indigo-500
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Pulse ring for active recording indication
      ctx.fillStyle = "rgba(239, 68, 68, 0.8)"; // red-500
      ctx.beginPath();
      ctx.arc(20, 20, 6, 0, 2 * Math.PI);
      ctx.fill();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, analyserNode]);

  // If we are actively recording, show the Canvas oscilloscope
  if (isRecording) {
    return (
      <div className="relative rounded-2xl bg-[#0c0c0e] p-4 border border-slate-800 shadow-inner overflow-hidden">
        <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-mono text-red-400 animate-pulse bg-slate-950/80 px-2 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          LIVE RECORDING
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={140}
          className="w-full h-[140px] block"
        />
      </div>
    );
  }

  // Render processed/finished audio waveforms or placeholder
  if (rmsLevels.length === 0) {
    return (
      <div className="h-[140px] flex flex-col items-center justify-center bg-[#0c0c0e]/30 border-2 border-dashed border-slate-800 rounded-2xl p-6 text-slate-500">
        <Volume2 className="h-8 w-8 stroke-1.5 mb-2 text-slate-600" />
        <p className="text-sm font-medium">Record or upload an explanation to view metrics</p>
        <p className="text-xs text-slate-500 mt-1">Waveform, pause rates, and speaking clarity will show here</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111114] rounded-2xl border border-slate-800 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Activity className="h-5 w-5 text-indigo-400" />
          <h3 className="font-semibold text-sm">Acoustic & Fluency Profiling</h3>
        </div>
        <div className="flex bg-[#0c0c0e] p-0.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-850">
          <button
            onClick={() => setActiveTab("waveform")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "waveform"
                ? "bg-[#18181b] text-indigo-400 border border-slate-800/80 shadow-sm"
                : "hover:text-slate-200"
            }`}
          >
            Amplitude Waveform
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "timeline"
                ? "bg-[#18181b] text-indigo-400 border border-slate-800/80 shadow-sm"
                : "hover:text-slate-200"
            }`}
          >
            Hesitation Timeline
          </button>
        </div>
      </div>

      {activeTab === "waveform" ? (
        <div>
          {/* Static detailed waveform with highlighted pause points */}
          <div className="relative h-[120px] flex items-end gap-[2px] pt-4 pb-1 bg-[#0c0c0e]/50 rounded-xl px-4 border border-slate-800/80">
            {rmsLevels.map((level, index) => {
              // Map index to percentage of duration to find speech type
              const progressPct = index / rmsLevels.length;
              const currentTime = progressPct * duration;

              // Check if current time falls in a pause interval
              const matchingInterval = pauseTimeline.find(
                (interval) => currentTime >= interval.start && currentTime <= interval.end
              );
              const isPause = matchingInterval ? matchingInterval.type === "pause" : false;

              // Scale the height
              const heightPct = Math.max(10, level * 280); // Min height so it's always slightly visible

              return (
                <div
                  key={index}
                  className="flex-1 rounded-t transition-all group relative"
                  style={{ height: `${heightPct}%` }}
                >
                  <div
                    className={`w-full h-full rounded-t transition-colors ${
                      isPause
                        ? "bg-amber-500 hover:bg-amber-400"
                        : "bg-indigo-500 hover:bg-indigo-450"
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 bg-slate-950 border border-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap font-mono shadow-xl">
                    {currentTime.toFixed(1)}s: {isPause ? "Silence/Pause" : "Speech"} (Vol: {(level * 100).toFixed(0)}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-2 px-1">
            <span>0.0s</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span> Speech Signal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> Pause/Hesitation
              </span>
            </div>
            <span>{duration.toFixed(1)}s</span>
          </div>
        </div>
      ) : (
        <div>
          {/* Timeline visualization bar */}
          <div className="relative h-7 bg-[#0c0c0e] rounded-lg overflow-hidden flex border border-slate-800">
            {pauseTimeline.map((segment, index) => {
              const segDuration = segment.end - segment.start;
              const percentage = (segDuration / duration) * 100;

              return (
                <div
                  key={index}
                  className={`h-full border-r border-white/5 transition-all cursor-pointer relative group ${
                    segment.type === "pause"
                      ? "bg-amber-500 hover:bg-amber-450"
                      : "bg-indigo-500 hover:bg-indigo-450"
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 bg-slate-950 border border-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap font-mono shadow-xl">
                    {segment.type === "pause" ? "Hesitation/Pause" : "Active Speaking"}: {segment.start.toFixed(1)}s - {segment.end.toFixed(1)}s ({segDuration.toFixed(1)}s)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-2 px-1">
            <span>0.0s</span>
            <span>Hesitation Timeline (Hover blocks to view durations)</span>
            <span>{duration.toFixed(1)}s</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-indigo-950/10 rounded-xl p-3 border border-indigo-900/20">
              <p className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase font-mono">Active Speech Segments</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">
                {pauseTimeline.filter(t => t.type === 'speech').length} <span className="text-xs font-normal text-slate-400">phrases</span>
              </p>
            </div>
            <div className="bg-amber-950/10 rounded-xl p-3 border border-amber-900/20">
              <p className="text-[11px] text-amber-500 font-medium tracking-wide uppercase font-mono">Detected Pauses</p>
              <p className="text-xl font-bold text-amber-500 mt-1">
                {pauseTimeline.filter(t => t.type === 'pause').length} <span className="text-xs font-normal text-slate-400">hesitations</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
