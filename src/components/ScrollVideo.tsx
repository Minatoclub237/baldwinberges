import { useEffect, useRef, useState } from 'react';

interface ScrollVideoProps {
  videoUrl: string;
}

// Mobile / touch devices can't reliably paint a <video> that is only seeked
// (never played), and createImageBitmap frame extraction is unsupported on many
// mobile browsers. On those devices we fall back to a plain autoplaying loop.
const detectMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  return coarsePointer || window.innerWidth < 768;
};

export default function ScrollVideo({ videoUrl }: ScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const targetScrollRef = useRef<number>(0);
  const lastDrawnFrameIndexRef = useRef<number>(-1);
  const seekingRef = useRef<boolean>(false);

  const [frames, setFrames] = useState<ImageBitmap[]>([]);
  const [framesReady, setFramesReady] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Decide the rendering strategy once, on mount.
  const [isMobile] = useState<boolean>(() => detectMobile());

  // Loading screen — fades out the instant the video can display its first frame
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
    if (!canvas || frames.length === 0) return;

    const frame = frames[index];
    if (!frame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get current client layout size
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = rect.width * dpr;
    const height = rect.height * dpr;

    // Resize canvas buffer if necessary
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

  // On mobile: force muted + kick off autoplay imperatively (most reliable).
  useEffect(() => {
    if (!isMobile) return;
    const video = mobileVideoRef.current;
    if (!video) return;
    video.muted = true;
    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          /* autoplay blocked — first frame still shows via preload */
        });
      }
    };
    tryPlay();
    // Retry once the browser reports it can play, in case the first call was too early
    video.addEventListener('canplay', tryPlay, { once: true });
    return () => video.removeEventListener('canplay', tryPlay);
  }, [isMobile]);

  // Passive scroll progress calculator (desktop scrub only)
  useEffect(() => {
    if (isMobile) return;
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
  }, [isMobile]);

  // Frame pre-extractor with cancellation support (desktop only)
  useEffect(() => {
    if (isMobile) return;
    let isCancelled = false;
    let extractedBitmaps: ImageBitmap[] = [];
    let objectUrl = '';

    const extractFrames = async () => {
      try {
        const response = await fetch(videoUrl);
        if (!response.ok) throw new Error('Fetch failed for scroll video');
        const blob = await response.blob();
        if (isCancelled) return;

        objectUrl = URL.createObjectURL(blob);
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = (e) => reject(e);
        });

        if (isCancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        const duration = video.duration;
        setVideoDuration(duration);

        // Clamp frames: Duration * 24 frames/sec, bounded between 30 and 120
        const frameCount = Math.min(Math.max(Math.round(duration * 24), 30), 120);

        // Compute scaling logic (max width 1280)
        const vWidth = video.videoWidth;
        const vHeight = video.videoHeight;
        let targetWidth = vWidth;
        let targetHeight = vHeight;
        if (vWidth > 1280) {
          targetWidth = 1280;
          targetHeight = Math.round((vHeight * 1280) / vWidth);
        }

        const times = Array.from({ length: frameCount }, (_, i) => {
          return (i / (frameCount - 1)) * (duration - 0.05);
        });

        const activeExtracted: ImageBitmap[] = [];
        for (let i = 0; i < frameCount; i++) {
          if (isCancelled) break;
          video.currentTime = times[i];

          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              resolve();
            };
            video.addEventListener('seeked', onSeeked);
          });

          if (isCancelled) break;

          try {
            const bitmap = await createImageBitmap(video, {
              resizeWidth: targetWidth,
              resizeHeight: targetHeight,
              resizeQuality: 'medium',
            });
            activeExtracted.push(bitmap);
          } catch (e) {
            console.error('Frame creation error:', e);
          }
        }

        if (isCancelled) {
          activeExtracted.forEach((b) => b.close());
          return;
        }

        extractedBitmaps = activeExtracted;
        setFrames(activeExtracted);
        setFramesReady(true);
      } catch (err) {
        console.warn('Bitmaps pre-extraction failed, using fallback video seek:', err);
      }
    };

    extractFrames();

    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      extractedBitmaps.forEach((b) => b.close());
    };
  }, [videoUrl, isMobile]);

  // RequestAnimationFrame loop for smoothed progress mapping (desktop scrub only)
  useEffect(() => {
    if (isMobile) return;
    let rAFId: number;
    let smoothed = 0;

    const tick = () => {
      const target = targetScrollRef.current;
      smoothed += (target - smoothed) * 0.1;

      // Snapping edge conditions
      if (Math.abs(target - smoothed) < 0.0001) {
        smoothed = target;
      }

      const activeDuration = videoDuration || 5;
      const targetTime = smoothed * activeDuration;

      if (framesReady && frames.length > 0) {
        const frameIndex = Math.max(0, Math.min(frames.length - 1, Math.round(smoothed * (frames.length - 1))));
        if (frameIndex !== lastDrawnFrameIndexRef.current) {
          drawFrame(frameIndex);
          lastDrawnFrameIndexRef.current = frameIndex;
        }
      } else {
        const fallbackVideo = fallbackVideoRef.current;
        if (fallbackVideo) {
          const delta = Math.abs(fallbackVideo.currentTime - targetTime);
          if (delta > 0.001 && !seekingRef.current) {
            seekingRef.current = true;
            fallbackVideo.currentTime = targetTime;
          }
        }
      }

      rAFId = requestAnimationFrame(tick);
    };

    rAFId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, [framesReady, frames, videoDuration, isMobile]);

  // Force redraw on window resizing to handle canvas cover math updates
  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => {
      if (framesReady && frames.length > 0 && lastDrawnFrameIndexRef.current !== -1) {
        drawFrame(lastDrawnFrameIndexRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [framesReady, frames, isMobile]);

  // Safety net: never trap the visitor behind the loader for more than 4s
  useEffect(() => {
    const safety = window.setTimeout(dismissLoader, 4000);
    return () => window.clearTimeout(safety);
  }, []);

  // Once high-quality frames are ready, the video is definitely displayable
  useEffect(() => {
    if (framesReady) dismissLoader();
  }, [framesReady]);

  const handleFallbackSeeked = () => {
    seekingRef.current = false;
  };

  return (
    <>
      <div id="scroll-video-container" className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        {isMobile ? (
          /* Mobile: plain autoplaying loop — reliably painted on iOS/Android */
          <video
            id="scroll-video-mobile"
            ref={mobileVideoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={dismissLoader}
            onCanPlay={dismissLoader}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            {/* 2D Canvas for High-Performance Bitmaps Rendering */}
            {framesReady && (
              <canvas
                id="scroll-video-canvas"
                ref={canvasRef}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* Fallback Video Tag — shown immediately so the background is alive on landing */}
            {!framesReady && (
              <video
                id="scroll-video-fallback"
                ref={fallbackVideoRef}
                src={videoUrl}
                muted
                playsInline
                preload="auto"
                onLoadedData={dismissLoader}
                onSeeked={handleFallbackSeeked}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </>
        )}

        {/* Aesthetic black overlay for text readability and contrast */}
        <div id="scroll-video-overlay" className="absolute inset-0 bg-black/20" />
      </div>

      {/* Elegant loading screen — covers the initial frame extraction, then fades away */}
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
