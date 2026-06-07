"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Area = { x: number; y: number; w: number; h: number };

export default function ImageCropper({
  src,
  aspect,
  onCrop,
  onCancel,
}: {
  src: string;
  aspect: number;
  onCrop: (cropped: string) => void;
  onCancel: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = new Image();
    el.onload = () => setImg(el);
    el.src = src;
  }, [src]);

  /* ── drag to move the crop window ── */
  const [area, setArea] = useState<Area | null>(null);
  const drag = useRef<{ startX: number; startY: number; area: Area } | null>(null);

  const resetArea = useCallback(() => {
    if (!img || !containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    let w = cw * 0.85;
    let h = w / aspect;
    if (h > ch * 0.85) {
      h = ch * 0.85;
      w = h * aspect;
    }
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    setArea({ x, y, w, h });
  }, [img, aspect]);

  useEffect(() => { resetArea(); }, [resetArea]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!area) return;
    drag.current = { startX: e.clientX, startY: e.clientY, area };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current || !containerRef.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const a = drag.current.area;
    let x = a.x + dx;
    let y = a.y + dy;
    x = Math.max(0, Math.min(x, cw - a.w));
    y = Math.max(0, Math.min(y, ch - a.h));
    setArea({ ...a, x, y });
  };
  const onMouseUp = () => { drag.current = null; };
  useEffect(() => {
    const up = () => { drag.current = null; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const crop = () => {
    if (!img || !area || !containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    /* map container coords to image coords (image is object-cover) */
    const scaleX = nw / cw;
    const scaleY = nh / ch;
    const sx = area.x * scaleX;
    const sy = area.y * scaleY;
    const sw = area.w * scaleX;
    const sh = area.h * scaleY;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    onCrop(canvas.toDataURL("image/jpeg", 0.85));
  };

  if (!img) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-faint">
        Loading…
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-paper shadow-2xl">
        <div className="border-b border-ink/10 px-5 py-4">
          <p className="text-sm font-semibold text-ink">Crop your photo</p>
        </div>
        <div className="p-4">
          <div
            ref={containerRef}
            className="relative mx-auto h-72 w-full overflow-hidden rounded-xl bg-black/5 sm:h-96"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={src} alt="" className="h-full w-full object-contain" />
            {area && (
              <div
                className="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                style={{ left: area.x, top: area.y, width: area.w, height: area.h }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-ink/10 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink/15 px-5 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={crop}
            className="rounded-full bg-saffron px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-clay"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
