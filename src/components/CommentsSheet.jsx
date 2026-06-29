import { useEffect, useRef, useState } from "react";
import { formatPostDate } from "../utils/helpers";

export default function CommentsSheet({ post, open, onClose, onAddComment }) {
  const [text, setText] = useState("");
  const [likedComments, setLikedComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // { id, author }
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setText(""); setReplyingTo(null); }
  }, [open, post?.id]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, post?.comments?.length]);

  if (!open || !post) return null;

  const toggleLike = (id) => {
    setLikedComments((prev) => {
      const liked = !prev[id];
      setLikeCounts((counts) => ({ ...counts, [id]: Math.max(0, (counts[id] ?? 0) + (liked ? 1 : -1)) }));
      return { ...prev, [id]: liked };
    });
  };

  const handleReply = (comment) => {
    setReplyingTo({ id: comment.id, author: comment.author });
    setText(`@${comment.author} `);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setText("");
  };

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAddComment(post.id, value, replyingTo?.id ?? null);
    setText("");
    setReplyingTo(null);
  };

  // Build nested structure: top-level comments with their replies
  const topLevel = post.comments.filter((c) => !c.parentId);
  const repliesFor = (parentId) => post.comments.filter((c) => c.parentId === parentId);

  const CommentRow = ({ comment, isReply = false }) => (
    <div className={`ig-comment-row${isReply ? " ig-comment-reply" : ""}`}>
      <div className="ig-comment-left">
        <div className={`ig-comment-avatar${isReply ? " ig-comment-avatar-sm" : ""}`}>
          {comment.author[0].toUpperCase()}
        </div>
      </div>
      <div className="ig-comment-body">
        <div className="ig-comment-top">
          <div>
            <p className="ig-comment-author">{comment.author}</p>
            <p className="ig-comment-text">{comment.text}</p>
          </div>
          <span className="ig-comment-time">{formatPostDate(comment.createdAt)}</span>
        </div>
        <div className="ig-comment-actions">
          <button
            className={`ig-comment-action-btn${likedComments[comment.id] ? " liked" : ""}`}
            onClick={() => toggleLike(comment.id)}
            aria-label="Beğen"
          >
            <svg viewBox="0 0 24 24" fill={likedComments[comment.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="16" height="16">
              <path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" />
            </svg>
          </button>
          <button className="ig-comment-action-btn ig-reply-btn" onClick={() => handleReply(comment)}>
            Yanıtla
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="comments-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ig-comments-sheet">
        <div className="ig-comments-handle" />

        <div className="ig-comments-header">
          <span className="ig-comments-title">Yorumlar</span>
          <button className="ig-comments-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="20" height="20">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ig-comments-list" ref={listRef}>
          {topLevel.length === 0 ? (
            <div className="ig-comments-empty">
              <p className="ig-comments-empty-title">Henüz yorum yok</p>
              <p className="ig-comments-empty-sub">İlk yorumu sen yaz.</p>
            </div>
          ) : topLevel.map((comment) => {
            const replies = repliesFor(comment.id);
            return (
              <div key={comment.id} className="ig-comment-thread">
                <div className="ig-comment-row">
                  <div className="ig-comment-left">
                    <div className="ig-comment-avatar">{comment.author[0].toUpperCase()}</div>
                    {replies.length > 0 && <div className="ig-comment-thread-line" />}
                  </div>
                  <div className="ig-comment-body">
                    <div className="ig-comment-top">
                      <div>
                        <p className="ig-comment-author">{comment.author}</p>
                        <p className="ig-comment-text">{comment.text}</p>
                      </div>
                      <span className="ig-comment-time">{formatPostDate(comment.createdAt)}</span>
                    </div>
                    <div className="ig-comment-actions">
                      <button className={`ig-comment-action-btn${likedComments[comment.id] ? " liked" : ""}`} onClick={() => toggleLike(comment.id)}>
                        <svg viewBox="0 0 24 24" fill={likedComments[comment.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="16" height="16">
                          <path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" />
                        </svg>
                        {likeCounts[comment.id] > 0 && <span className="ig-comment-like-count">{likeCounts[comment.id]}</span>}
                      </button>
                      <button className="ig-comment-action-btn ig-reply-btn" onClick={() => handleReply(comment)}>Yanıtla</button>
                    </div>
                  </div>
                </div>

                {replies.map((reply) => (
                  <div key={reply.id} className="ig-comment-row ig-comment-reply">
                    <div className="ig-comment-left">
                      <div className="ig-comment-avatar ig-comment-avatar-sm">{reply.author[0].toUpperCase()}</div>
                    </div>
                    <div className="ig-comment-body">
                      <div className="ig-comment-top">
                        <div>
                          <p className="ig-comment-author">{reply.author}</p>
                          <p className="ig-comment-text">{reply.text}</p>
                        </div>
                        <span className="ig-comment-time">{formatPostDate(reply.createdAt)}</span>
                      </div>
                      <div className="ig-comment-actions">
                        <button className={`ig-comment-action-btn${likedComments[reply.id] ? " liked" : ""}`} onClick={() => toggleLike(reply.id)}>
                          <svg viewBox="0 0 24 24" fill={likedComments[reply.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="16" height="16">
                            <path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" />
                          </svg>
                          {likeCounts[reply.id] > 0 && <span className="ig-comment-like-count">{likeCounts[reply.id]}</span>}
                        </button>
                        <button className="ig-comment-action-btn ig-reply-btn" onClick={() => handleReply(comment)}>Yanıtla</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {replyingTo && (
          <div className="ig-replying-to">
            <span>{replyingTo.author} kişisine yanıtlanıyor</span>
            <button onClick={cancelReply}>✕</button>
          </div>
        )}

        <form className="ig-comment-form" onSubmit={submit}>
          <button className="ig-comment-add-btn" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <input
            ref={inputRef}
            className="ig-comment-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Yorum ekle..."
          />
          <button className="ig-comment-submit-btn" type="submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
