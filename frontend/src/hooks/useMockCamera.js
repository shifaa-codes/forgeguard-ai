import { useEffect, useState, useRef } from 'react';
import { mockCameraStates } from '../data/mockData';

/* MOCK CAMERA — cycles through predefined states.
   Replace with real WebSocket stream from FastAPI. */
export function useMockCamera({ interval = 4000, active = true } = {}) {
  const [stateIdx, setStateIdx] = useState(0);
  const [fps, setFps] = useState(28);
  const [processing, setProcessing] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => {
      setProcessing(true);
      setTimeout(() => {
        setStateIdx((i) => {
          // Weighted random: prefer good products
          const weights = [3, 2, 1.5, 1.2, 0.6];
          const pool = weights.flatMap((w, i) => Array(Math.round(w * 2)).fill(i));
          const next = pool[Math.floor(Math.random() * pool.length)];
          return next;
        });
        setProcessing(false);
      }, 700);
    }, interval);
    return () => clearInterval(timer.current);
  }, [interval, active]);

  useEffect(() => {
    const f = setInterval(() => {
      setFps(26 + Math.floor(Math.random() * 4));
    }, 1500);
    return () => clearInterval(f);
  }, []);

  return {
    current: mockCameraStates[stateIdx],
    fps,
    processing,
    isMock: true,
  };
}