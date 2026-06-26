import { useEffect, useState } from "react";
import { formatPostDate } from "../utils/helpers";

export default function CommentsSheet({ post, open, onClose, onAddComment }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) setText("");
  }, [open, post?.id]);

  if (!open || !post) return null;

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAddComment(post.id, value);
    setText("");
  };

  return (
    <div className="comments-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="comments-sheet">
        <div className="comments-handle" />
        <div className="comments-header">
          <p className="comments-title">Yorumlar</p>
          <button className="comments-close" onClick={onClose}>✕</button>
        </div>
        <div className="comments-post-line">
          <div className="post-avatar small">{post.childName[0].toUpperCase()}</div>
          <div>
            <div className="post-name">{post.childName}</div>
            <div className="post-time">{formatPostDate(post.createdAt)}</div>
          </div>
        </div>
        <div className="comments-list">
          {post.comments.length === 0 ? (
            <p className="comments-empty">İlk yorumu sen yaz.</p>
          ) : post.comments.map((comment) => (
            <div key={comment.id} className="comment-row">
              <div className="comment-avatar">{comment.author[0].toUpperCase()}</div>
              <div className="comment-bubble">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-time">{formatPostDate(comment.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
        <form className="comment-form" onSubmit={submit}>
          <input className="comment-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Yorum ekle..." />
          <button className="comment-submit" type="submit" disabled={!text.trim()}>Paylaş</button>
        </form>
      </div>
    </div>
  );
}
