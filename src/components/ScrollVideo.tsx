import { useEffect, useRef, useState } from 'react';

interface ScrollVideoProps {
  videoUrl: string;
}

const isSmallScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default function ScrollVideo({ videoUrl }: ScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetScrollRef = useRef<number>(0);
  const lastDrawnFrameIndexRef = useRef<number>(-1);

  // Frames live in a ref so growing the set never re-runs the render loop (no jumps)
  const framesRef = useRef<ImageBitmap[]>([]);
  const [framesReady, setFramesReady] = useState<boolean>(false);
  // Last-resort background if extraction fails entirely (rare, local video)
  const [rawFallback, setRawFallback] = useState<boolean>(false);

  // Loading screen — fades out the instant the background is displayable
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [fadeLoader, setFadeLoader] = useState<boolean>(false);

  const dismissLoader = () => {
    setFadeLoader((already: boolean) => {
      if (already) return already;
      window.setTimeout(() => setShowLoader(false), 800);
      return true;
    });
  };

  // Draw a frame with 'cover' sizing arithmetic
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length === 0) return;

    const frame = frames[index];
    if (!frame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = rect.width * dpr;
    const height = rect.height * dpr;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const fWidth = frame.width;
    const fHeight = frame.height;

    // "cover" math
    const scale = Math.max(width / fWidth, height / fHeight);
    const drawWidth = fWidth * scale;
    const drawHeight = fHeight * scale;

    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(frame, dx, dy, drawWidth, drawHeight);
  };

  // Passive scroll progress calculator (0 → 1)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const maxScroll = scrollHeight - innerHeight;
      targetScrollRef.current = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial sync

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Frame pre-extractor — decodes the video into ImageBitmaps once, so scrubbing
  // is buttery smooth on EVERY device (canvas paints reliably, unlike seeking a
  // raw <video> which is black on mobile). Robust for iOS/Android.
  useEffect(() => {
    let isCancelled = false;
    let extractedBitmaps: ImageBitmap[] = [];

    const seekTo = (video: HTMLVideoElement, time: number) =>
      new Promise<void>((resolve) => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          video.removeEventListener('seeked', done);
          resolve();
        };
        video.addEventListener('seeked', done);
        // Safety: never hang forever on a stuck seek
        window.setTimeout(done, 400);
        video.currentTime = time;
      });

    const extractFrames = async () => {
      try {
        const video = document.createElement('video');
        video.src = videoUrl; // same-origin → no CORS taint, direct decode
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        (video as any).crossOrigin = 'anonymous';
        video.preload = 'auto';

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = (e) => reject(e);
        });
        if (isCancelled) return;

        // iOS needs the pipeline "primed" with a play() before frames decode on seek
        try {
          await video.play();
          video.pause();
        } catch {
          /* muted inline play is allowed; ignore if blocked */
        }

        const duration = video.duration || 5;
        const small = isSmallScreen();

        // Fewer, lighter frames on phones = faster ready + smooth enough after smoothing
        const maxFrames = small ? 60 : 120;
        const frameCount = Math.min(Math.max(Math.round(duration * 24), 30), maxFrames);

        const maxWidth = small ? 720 : 1280;
        const vWidth = video.videoWidth || maxWidth;
        const vHeight = video.videoHeight || Math.round((maxWidth * 9) / 16);
        let targetWidth = vWidth;
        let targetHeight = vHeight;
        if (vWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = Math.round((vHeight * maxWidth) / vWidth);
        }

        // Offscreen canvas capture works on every browser (unlike createImageBitmap
        // resize options, which are patchy on Safari)
        const off = document.createElement('canvas');
        off.width = targetWidth;
        off.height = targetHeight;
        const octx = off.getContext('2d');
        if (!octx) throw new Error('No 2D context for extraction');

        const times = Array.from({ length: frameCount }, (_, i) => {
          return (i / (frameCount - 1)) * (duration - 0.05);
        });

        const activeExtracted: ImageBitmap[] = [];
        // Enough frames to scrub fluidly → we can enter scroll mode without
        // waiting for the full set. Never a looping placeholder.
        const revealThreshold = Math.min(frameCount, small ? 24 : 30);

        const publish = () => {
          framesRef.current = activeExtracted;
          lastDrawnFrameIndexRef.current = -1; // force redraw at new resolution
        };

        let revealed = false;
        for (let i = 0; i < frameCount; i++) {
          if (isCancelled) break;
          await seekTo(video, times[i]);
          if (isCancelled) break;

          try {
            octx.drawImage(video, 0, 0, targetWidth, targetHeight);
            const bitmap = await createImageBitmap(off);
            activeExtracted.push(bitmap);
          } catch (e) {
            console.error('Frame capture error:', e);
          }

          if (!revealed && activeExtracted.length >= revealThreshold) {
            // Scroll mode is live from here — fluid, driven by scroll, never looping
            revealed = true;
            extractedBitmaps = activeExtracted;
            publish();
            setFramesReady(true);
            dismissLoader();
          } else if (revealed && activeExtracted.length % 8 === 0) {
            publish(); // keep refining resolution as more frames arrive
          }
        }

        if (isCancelled) {
          activeExtracted.forEach((b) => b.close());
          return;
        }

        extractedBitmaps = activeExtracted;
        publish();
        setFramesReady(true);
        dismissLoader();
      } catch (err) {
        console.warn('Frame pre-extraction failed:', err);
        if (!isCancelled) {
          setRawFallback(true);
          dismissLoader();
        }
      }
    };

    extractFrames();

    return () => {
      isCancelled = true;
      extractedBitmaps.forEach((b) => b.close());
    };
  }, [videoUrl]);

  // RequestAnimationFrame loop — smoothed scroll → frame index (the "fluid" part)
  useEffect(() => {
    let rAFId: number;
    let smoothed = 0;

    const tick = () => {
      const target = targetScrollRef.current;
      smoothed += (target - smoothed) * 0.12;

      if (Math.abs(target - smoothed) < 0.0001) {
        smoothed = target;
      }

      const len = framesRef.current.length;
      if (framesReady && len > 0) {
        const frameIndex = Math.max(0, Math.min(len - 1, Math.round(smoothed * (len - 1))));
        if (frameIndex !== lastDrawnFrameIndexRef.current) {
          drawFrame(frameIndex);
          lastDrawnFrameIndexRef.current = frameIndex;
        }
      }

      rAFId = requestAnimationFrame(tick);
    };

    rAFId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, [framesReady]);

  // Redraw on resize so the 'cover' math stays correct
  useEffect(() => {
    const handleResize = () => {
      if (framesReady && framesRef.current.length > 0) {
        lastDrawnFrameIndexRef.current = -1; // force a fresh draw at the new size
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [framesReady]);

  // Hide the loader as soon as the canvas has something to show
  useEffect(() => {
    if (framesReady) dismissLoader();
  }, [framesReady]);

  // Safety net: if extraction is unusually slow, don't trap the visitor behind
  // the loader — reveal a plain video background rather than a black screen.
  useEffect(() => {
    const safety = window.setTimeout(() => {
      if (!framesReady) setRawFallback(true);
      dismissLoader();
    }, 7000);
    return () => window.clearTimeout(safety);
  }, [framesReady]);

  return (
    <>
      <div id="scroll-video-container" className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        {/* Scroll-scrubbed canvas — the real experience, fluid on every device,
            in scroll mode from the very first paint (never a looping placeholder) */}
        {framesReady && (
          <canvas
            id="scroll-video-canvas"
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Last-resort background only if frame extraction failed entirely (rare) */}
        {rawFallback && !framesReady && (
          <video
            id="scroll-video-fallback"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Darkened scrim — keeps text readable over bright video frames (mobile) */}
        <div
          id="scroll-video-overlay"
          className="absolute inset-0 bg-black/45 sm:bg-black/35"
        />
      </div>

      {/* Elegant loading screen — covers the initial decode, then fades away */}
      {showLoader && (
        <div
          id="scroll-video-loader"
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ease-out ${
            fadeLoader ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={fadeLoader}
        >
          <div className="flex flex-col items-center gap-5">
            <span className="animate-loader-pulse font-mono text-3xl font-medium tracking-tight text-white">
              (BB)
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
              Baldwin Berges
            </span>
          </div>
        </div>
      )}
    </>
  );
}
