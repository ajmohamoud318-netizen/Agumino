import Icon from "./Icon";
import { formatPostDate, compositionStyle } from "../utils/helpers";

export default function PostCard({ id, childName, imageURL, frameURL, composition, createdAt, liked, likeCount = 1, comments = [], onToggleLike, onOpenComments, onOpenOptions }) {
  const commentCount = comments.length;
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">{childName[0].toUpperCase()}</div>
        <div className="post-meta">
          <div className="post-name">{childName}</div>
          <div className="post-time">{formatPostDate(createdAt)}</div>
        </div>
        {frameURL && <img className="post-frame-mini" src={frameURL} alt="" />}
        <button className="post-menu-btn" onClick={() => onOpenOptions(id)} aria-label="Anı seçenekleri">
          <Icon name="dots" style={{ width: 20, height: 20, color: "var(--muted)" }} />
        </button>
      </div>
      <div className="post-media">
        <img className="post-photo" style={compositionStyle(composition)} src={imageURL} alt={`${childName} anısı`} />
        {frameURL && <img className="post-frame-overlay" src={frameURL} alt="" />}
      </div>
      <div className="post-actions">
        <button className={`post-action-btn${liked ? " liked" : ""}`} onClick={() => onToggleLike(id)} aria-label="Beğen">
          <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" /></svg>
        </button>
        <button className="post-action-btn" onClick={() => onOpenComments(id)} aria-label="Yorum yap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </button>
        <button className="post-action-btn" aria-label="Paylaş">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7Z" /></svg>
        </button>
      </div>
      <div className="post-stats">
        <span>{likeCount} beğeni</span>
        <button className="post-comments-link" onClick={() => onOpenComments(id)}>{commentCount} yorum</button>
      </div>
      <div className="post-caption">
        <strong>{childName}</strong>
        <span> yeni bir anı paylaştı.</span>
      </div>
      {commentCount > 0 && (
        <button className="post-preview-comment" onClick={() => onOpenComments(id)}>
          <strong>{comments[commentCount - 1].author}</strong>
          <span> {comments[commentCount - 1].text}</span>
        </button>
      )}
      <div className="post-activity">Aile albümüne eklendi</div>
    </div>
  );
}
