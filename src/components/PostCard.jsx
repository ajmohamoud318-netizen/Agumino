import { useRef, useState } from "react";
import Icon from "./Icon";
import { formatPostDate, compositionStyle } from "../utils/helpers";

export default function PostCard({ id, childName, imageURL, frameURL, composition, createdAt, liked, likeCount = 1, comments = [], onToggleLike, onOpenComments, onOpenOptions }) {
  const commentCount = comments.length;
  const [heartAnim, setHeartAnim] = useState(null); // { x, y, tx, ty }
  const [likeAnim, setLikeAnim] = useState(false);
  const lastTap = useRef(0);
  const mediaRef = useRef(null);
  const likeBtnRef = useRef(null);

  const triggerLike = (tapX, tapY) => {
    if (!liked) onToggleLike(id);

    // Calculate where the heart button is relative to the photo
    const media = mediaRef.current?.getBoundingClientRect();
    const btn = likeBtnRef.current?.getBoundingClientRect();
    if (!media || !btn) return;

    const x = tapX - media.left;
    const y = tapY - media.top;
    const tx = (btn.left + btn.width / 2) - (media.left + x);
    const ty = (btn.top + btn.height / 2) - (media.top + y);

    setHeartAnim({ x, y, tx, ty });
    setTimeout(() => setHeartAnim(null), 900);
  };

  const handleDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      const touch = e.changedTouches?.[0] || e;
      triggerLike(touch.clientX, touch.clientY);
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 400);
    }
    lastTap.current = now;
  };

  const handleLikeBtn = () => {
    onToggleLike(id);
    if (!liked) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 400);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">{childName[0].toUpperCase()}</div>
        <div className="post-meta">
          <div className="post-name">{childName}</div>
          <div className="post-time">{formatPostDate(createdAt)}</div>
        </div>
        <button className="post-menu-btn" onClick={() => onOpenOptions(id)} aria-label="Anı seçenekleri">
          <Icon name="dots" style={{ width: 20, height: 20, color: "var(--muted)" }} />
        </button>
      </div>

      <div className="post-media" ref={mediaRef} onClick={handleDoubleTap}>
        <img className="post-photo" style={compositionStyle(composition)} src={imageURL} alt={`${childName} anısı`} />
        {frameURL && <img className="post-frame-overlay" src={frameURL} alt="" />}
        {heartAnim && (
          <div
            className="post-heart-pop"
            style={{
              left: heartAnim.x,
              top: heartAnim.y,
              "--tx": `${heartAnim.tx}px`,
              "--ty": `${heartAnim.ty}px`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="#e53935" width="80" height="80" style={{ filter: "drop-shadow(0 2px 8px rgba(229,57,53,0.5))" }}>
              <path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" />
            </svg>
          </div>
        )}
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button
            ref={likeBtnRef}
            className={`post-action-btn${liked ? " liked" : ""}${likeAnim ? " like-anim" : ""}`}
            onClick={handleLikeBtn}
            aria-label="Beğen"
          >
            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" /></svg>
          </button>
          <button className="post-action-btn" onClick={() => onOpenComments(id)} aria-label="Yorum yap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </button>
          <button className="post-action-btn" aria-label="Paylaş">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7Z" /></svg>
          </button>
        </div>
        <button className="post-action-btn post-bookmark" aria-label="Kaydet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
        </button>
      </div>

      <div className="post-stats">
        <button className="post-like-count" onClick={handleLikeBtn}>{likeCount} beğeni</button>
      </div>

      <div className="post-caption">
        <strong>{childName}</strong>
        <span> yeni bir anı paylaştı.</span>
      </div>

      {commentCount > 0 && (
        <button className="post-view-comments" onClick={() => onOpenComments(id)}>
          {commentCount > 1 ? `Tüm ${commentCount} yorumu gör` : comments[0].text}
        </button>
      )}

      <div className="post-activity">{formatPostDate(createdAt)}</div>
    </div>
  );
}
