"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, PostComment } from "@/lib/db";

const CATEGORY_STYLE: Record<string, string> = {
  blog: "border-gold/40 bg-gold/10 text-ink",
  news: "border-saffron/30 bg-saffron/5 text-saffron",
  update: "border-ink/20 bg-paper-deep text-ink-soft",
  announcement: "border-saffron/30 bg-saffron/5 text-saffron",
  guidance: "border-gold/40 bg-gold/10 text-ink",
  conference: "border-maroon/30 bg-maroon/5 text-maroon",
  collaboration: "border-ink/20 bg-paper-deep text-ink-soft",
};

function formatDate(iso: string) {
  return new Date(iso.endsWith("Z") ? iso : `${iso}Z`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" },
  );
}

export default function PostCard({ post }: { post: Post }) {
  const [like, setLike] = useState({ likes: post.likes, liked: post.likedByMe });
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [commentCount, setCommentCount] = useState(post.comments);

  const toggleLike = async () => {
    if (busy) return;
    setBusy(true);
    setLike((s) => ({ likes: s.likes + (s.liked ? -1 : 1), liked: !s.liked }));
    try {
      const res = await fetch(`/api/vageshwari/${post.id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.ok) setLike({ likes: data.likes, liked: data.liked });
    } catch {
      setLike({ likes: post.likes, liked: post.likedByMe });
    } finally {
      setBusy(false);
    }
  };

  const openComments = async () => {
    setCommentsOpen((o) => !o);
    if (comments === null) {
      try {
        const res = await fetch(`/api/vageshwari/${post.id}/comments`);
        const data = await res.json();
        if (data.ok) setComments(data.comments);
      } catch {
        setComments([]);
      }
    }
  };

  const longBody = post.body.length > 360;
  const shownBody =
    longBody && !expanded ? `${post.body.slice(0, 360).trimEnd()}…` : post.body;

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/8 bg-paper transition-colors hover:border-ink/15">
      {/* Author row */}
      <div className="flex items-center gap-3 px-5 pt-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-saffron/10 font-medium text-saffron">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{post.author}</p>
          <p className="text-xs text-ink-faint">{formatDate(post.created_at)}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-0.5 text-[11px] font-medium capitalize ${
            CATEGORY_STYLE[post.category] ?? CATEGORY_STYLE.update
          }`}
        >
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pt-3">
        <h2 className="display text-xl text-ink">{post.title}</h2>
        {post.body && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {shownBody}
            {longBody && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="ml-1 text-saffron underline underline-offset-2"
              >
                {expanded ? "less" : "read more"}
              </button>
            )}
          </p>
        )}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block max-w-full truncate text-sm text-saffron underline underline-offset-2"
          >
            {post.link.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      {/* Photo */}
      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="mt-4 max-h-[480px] w-full object-cover"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 px-5 py-3">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={like.liked}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
            like.liked
              ? "border-saffron/40 bg-saffron/10 text-saffron"
              : "border-ink/15 text-ink-soft hover:border-ink/40"
          }`}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill={like.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {like.likes}
        </button>
        <button
          type="button"
          onClick={openComments}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink/40"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {commentCount}
        </button>
      </div>

      {/* Comments */}
      {commentsOpen && (
        <div className="border-t border-ink/8 bg-paper-warm/40 px-5 py-4">
          {comments === null ? (
            <p className="text-xs text-ink-faint">Loading…</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="grid size-7 shrink-0 place-items-center rounded-full bg-ink/5 text-xs font-medium text-ink-soft">
                    {c.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 rounded-xl bg-paper px-3 py-2">
                    <p className="text-xs font-medium text-ink">
                      {c.author}{" "}
                      <span className="font-normal text-ink-faint">
                        · {formatDate(c.created_at)}
                      </span>
                    </p>
                    <p className="mt-0.5 whitespace-pre-line text-sm text-ink-soft">
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <CommentBox
            postId={post.id}
            onPosted={(c) => {
              setComments((prev) => [...(prev ?? []), c]);
              setCommentCount((n) => n + 1);
            }}
          />
        </div>
      )}
    </article>
  );
}

function CommentBox({
  postId,
  onPosted,
}: {
  postId: number;
  onPosted: (c: PostComment) => void;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 2 || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/vageshwari/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      if (data.ok) {
        onPosted({
          id: Date.now(),
          author: "You",
          body: body.trim(),
          created_at: new Date().toISOString(),
        });
        setBody("");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment…"
        maxLength={2000}
        className="min-w-0 flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
      />
      <button
        type="submit"
        disabled={sending || body.trim().length < 2}
        className="rounded-full bg-saffron px-5 py-2 text-xs text-paper transition-transform hover:scale-[1.03] disabled:opacity-50"
      >
        {sending ? "…" : "Post"}
      </button>
    </form>
  );
}
