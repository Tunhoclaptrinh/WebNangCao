import { useEffect, useRef, useState } from 'react';

/**
 * Custom Hook: useFpsMeter
 * Đo lường khung hình trên giây (FPS) thời gian thực bằng requestAnimationFrame.
 * Cho phép trực quan hóa hiện tượng giật/lag (jank) khi cuộn 10.000 phần tử thật so với danh sách ảo hóa.
 */
export function useFpsMeter(): number {
  const [fps, setFps] = useState<number>(60);
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const loop = (now: number) => {
      frameCount.current++;
      const elapsed = now - lastTime.current;

      if (elapsed >= 500) {
        const currentFps = Math.round((frameCount.current * 1000) / elapsed);
        setFps(Math.min(60, currentFps));
        frameCount.current = 0;
        lastTime.current = now;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return fps;
}
