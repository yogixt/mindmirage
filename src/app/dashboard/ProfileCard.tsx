"use client";

import { useEffect, useRef, useState } from "react";
import ImageCropper from "@/components/ImageCropper";

type Profile = {
  bio: string;
  intention: string;
  avatar: string | null;
  cover: string | null;
};

async function compress(file: File, maxDim: number, quality = 0.8): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const el = new Image();
      el.onload = () => res(el);
      el.onerror = rej;
      el.src = url;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function CameraIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function ProfileCard({
  name,
  email,
  fallbackImage,
}: {
  name: string;
  email: string;
  fallbackImage: string | null;
}) {
  const [p, setP] = useState<Profile>({ bio: "", intention: "", avatar: null, cover: null });
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [intention, setIntention] = useState("");
  const [saving, setSaving] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState<{ src: string; kind: "avatar" | "cover" } | null>(null);
  const [dropOver, setDropOver] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.profile) {
          setP({
            bio: d.profile.bio ?? "",
            intention: d.profile.intention ?? "",
            avatar: d.profile.avatar ?? null,
            cover: d.profile.cover ?? null,
          });
          setBio(d.profile.bio ?? "");
          setIntention(d.profile.intention ?? "");
        }
      })
      .catch(() => {});
  }, []);

  const save = async (patch: Partial<Profile>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (data.ok) setP((prev) => ({ ...prev, ...patch }) as Profile);
    } finally {
      setSaving(false);
    }
  };

  const onFile = (file: File, kind: "avatar" | "cover") => {
    const src = URL.createObjectURL(file);
    setCrop({ src, kind });
  };

  const onCropDone = async (dataUrl: string, kind: "avatar" | "cover") => {
    URL.revokeObjectURL(crop?.src ?? "");
    setCrop(null);
    await save({ [kind]: dataUrl } as Partial<Profile>);
  };

  const avatarSrc = p.avatar ?? fallbackImage;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
      {/* Cover */}
      <div
        className={`relative h-36 w-full sm:h-44 transition-colors ${
          dropOver ? "ring-2 ring-saffron" : ""
        }`}
        onDragOver={(e) => { e.preventDefault(); setDropOver(true); }}
        onDragLeave={() => setDropOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f, "cover");
        }}
      >
        {p.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-saffron/30 via-gold/30 to-saffron/20">
            <span className="text-xs text-ink-faint">Drag a photo here</span>
          </div>
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => coverRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-sm backdrop-blur transition-colors hover:bg-paper"
          >
            <CameraIcon />
            {p.cover ? "Change" : "Add cover"}
          </button>
          {p.cover && (
            <button
              type="button"
              onClick={() => void save({ cover: null })}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm backdrop-blur transition-colors hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f, "cover");
            e.target.value = "";
          }}
        />
      </div>

      {/* Avatar + name */}
      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end justify-between">
          <div className="relative">
            <span className="block size-20 overflow-hidden rounded-full bg-paper-warm ring-4 ring-paper sm:size-24">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-2xl font-bold text-saffron">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full bg-ink text-paper shadow transition-transform hover:scale-105"
            >
              <CameraIcon className="size-3" />
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f, "avatar");
                e.target.value = "";
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (editing) {
                void save({ bio, intention });
              }
              setEditing(!editing);
            }}
            disabled={saving}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
              editing
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border border-ink/15 text-ink hover:border-ink"
            }`}
          >
            {saving ? "Saving…" : editing ? "Save profile" : "Edit profile"}
          </button>
        </div>

        <h3 className="mt-3 text-xl font-bold text-ink">{name}</h3>
        <p className="text-xs text-ink-faint">{email}</p>

        {editing ? (
          <div className="mt-3 space-y-2.5">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={600}
              placeholder="Your bio — a few lines about you and your journey ✨"
              className="w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              maxLength={200}
              placeholder="Set your intention (sankalpa) — e.g. One chapter of the Gita, every day."
              className="w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
        ) : (
          <>
            {p.bio && (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {p.bio}
              </p>
            )}
            {p.intention && (
              <p className="mt-3 rounded-xl bg-saffron/5 px-4 py-2.5 text-sm italic text-saffron ring-1 ring-saffron/15">
                <span className="deva mr-1.5 not-italic">सङ्कल्प</span>
                {p.intention}
              </p>
            )}
            {!p.bio && !p.intention && (
              <p className="mt-3 text-sm text-ink-faint">
                Add a bio and set your intention — tap Edit profile.
              </p>
            )}
          </>
        )}
      </div>

      {/* Crop modal */}
      {crop && (
        <ImageCropper
          src={crop.src}
          aspect={crop.kind === "cover" ? 16 / 5 : 1}
          onCrop={(dataUrl) => void onCropDone(dataUrl, crop.kind)}
          onCancel={() => {
            URL.revokeObjectURL(crop.src);
            setCrop(null);
          }}
        />
      )}
    </div>
  );
}
