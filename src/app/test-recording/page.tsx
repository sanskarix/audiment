'use client';

import { useState, useRef } from 'react';

export default function TestRecordingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [blobInfo, setBlobInfo] = useState('');

  const log = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      log(`Stream obtained: ${stream.getTracks().map(t => `${t.kind}:${t.readyState}`).join(', ')}`);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
        log('Preview playing');
      }
      setStatus('previewing');
    } catch (err: any) {
      log(`Camera error: ${err.message}`);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];

    // Log supported types
    const types = ['video/webm', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/mp4'];
    types.forEach(t => log(`  ${t}: ${MediaRecorder.isTypeSupported(t)}`));

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(streamRef.current);
      log(`MediaRecorder created with mimeType: ${recorder.mimeType}`);
    } catch (err: any) {
      log(`MediaRecorder failed: ${err.message}`);
      return;
    }

    recorder.ondataavailable = (e) => {
      log(`ondataavailable: size=${e.data.size}, type=${e.data.type}`);
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onerror = (e: any) => {
      log(`recorder.onerror: ${e.error?.message || 'unknown'}`);
    };

    recorder.onstop = () => {
      log(`recorder.onstop fired. Chunks: ${chunksRef.current.length}, total size: ${chunksRef.current.reduce((a, c) => a + c.size, 0)} bytes`);

      if (chunksRef.current.length === 0) {
        log('ERROR: No chunks!');
        return;
      }

      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0].type || 'video/webm' });
      const url = URL.createObjectURL(blob);
      log(`Blob created: size=${blob.size}, type=${blob.type}`);
      setBlobInfo(`Size: ${(blob.size / 1024).toFixed(1)} KB, Type: ${blob.type}`);
      setReviewUrl(url);
      setStatus('reviewing');
    };

    recorderRef.current = recorder;
    recorder.start();
    log(`Recording started, state: ${recorder.state}`);
    setStatus('recording');

    // Auto-stop after 5 seconds for testing
    setTimeout(() => {
      if (recorderRef.current?.state === 'recording') {
        log('Auto-stopping after 5s...');
        recorderRef.current.stop();
      }
    }, 5000);
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') {
      log('Manual stop');
      recorderRef.current.stop();
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', maxWidth: 800, margin: '0 auto' }}>
      <h1>MediaRecorder Test</h1>
      <p>Status: <strong>{status}</strong></p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={startCamera} disabled={status !== 'idle'}>1. Start Camera</button>
        <button onClick={startRecording} disabled={status !== 'previewing'}>2. Start Recording (5s)</button>
        <button onClick={stopRecording} disabled={status !== 'recording'}>3. Stop Early</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3>Live Preview</h3>
          <video ref={videoRef} muted playsInline style={{ width: '100%', background: '#000', aspectRatio: '16/9' }} />
        </div>
        <div>
          <h3>Review</h3>
          {reviewUrl ? (
            <>
              <video ref={reviewRef} src={reviewUrl} controls autoPlay muted playsInline style={{ width: '100%', background: '#000', aspectRatio: '16/9' }} />
              <p style={{ fontSize: 12, color: '#666' }}>{blobInfo}</p>
            </>
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
              No recording yet
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20, background: '#111', color: '#0f0', padding: 15, borderRadius: 8, maxHeight: 300, overflow: 'auto', fontSize: 12 }}>
        <h3 style={{ margin: '0 0 10px' }}>Debug Log</h3>
        {logs.map((l, i) => <div key={i}>{l}</div>)}
        {logs.length === 0 && <div style={{ color: '#555' }}>Click "Start Camera" to begin...</div>}
      </div>
    </div>
  );
}
