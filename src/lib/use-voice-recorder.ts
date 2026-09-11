import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Records microphone audio as PCM through the Web Audio API and encodes a
 * complete 16 kHz mono WAV file. WAV keeps every clip decodable on Android
 * Chrome and iOS Safari alike, unlike raw MediaRecorder fragments.
 */

function encodeWav(chunks: Float32Array[], sampleRate: number, targetRate = 16000): Blob {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  const ratio = sampleRate / targetRate;
  const outLength = ratio > 1 ? Math.floor(merged.length / ratio) : merged.length;
  const samples = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) samples[i] = merged[Math.floor(i * (ratio > 1 ? ratio : 1))] ?? 0;
  const rate = ratio > 1 ? targetRate : sampleRate;

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (pos: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(pos + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let pos = 44;
  for (const s of samples) {
    const clamped = Math.max(-1, Math.min(1, s));
    view.setInt16(pos, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    pos += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

interface Session {
  stream: MediaStream;
  ctx: AudioContext;
  source: MediaStreamAudioSourceNode;
  node: ScriptProcessorNode;
  chunks: Float32Array[];
}

export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const session = useRef<Session | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    const s = session.current;
    if (!s) return null;
    s.stream.getTracks().forEach((t) => t.stop());
    s.node.disconnect();
    s.source.disconnect();
    session.current = null;
    return s;
  }, []);

  useEffect(() => () => void cleanup(), [cleanup]);

  const start = useCallback(async () => {
    if (session.current) return true;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      return false;
    }
    const Ctx: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    if (ctx.state === "suspended") await ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    const node = ctx.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array[] = [];
    node.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(input));
      let peak = 0;
      for (let i = 0; i < input.length; i += 32) peak = Math.max(peak, Math.abs(input[i] ?? 0));
      setLevel(peak);
    };
    source.connect(node);
    node.connect(ctx.destination);
    session.current = { stream, ctx, source, node, chunks };
    setSeconds(0);
    setRecording(true);
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return true;
  }, []);

  /** Stops recording and returns the finished WAV clip (null if nothing usable). */
  const stop = useCallback(async (): Promise<Blob | null> => {
    const s = cleanup();
    setRecording(false);
    setLevel(0);
    if (!s) return null;
    const blob = encodeWav(s.chunks, s.ctx.sampleRate);
    await s.ctx.close().catch(() => undefined);
    return blob.size < 8000 ? null : blob;
  }, [cleanup]);

  const cancel = useCallback(() => {
    const s = cleanup();
    setRecording(false);
    setLevel(0);
    void s?.ctx.close().catch(() => undefined);
  }, [cleanup]);

  return { recording, seconds, level, start, stop, cancel };
}
