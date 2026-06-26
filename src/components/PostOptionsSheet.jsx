import Icon from "./Icon";
import { formatPostDate } from "../utils/helpers";

export default function PostOptionsSheet({ post, open, onClose, onEditFrame, onDelete }) {
  if (!open || !post) return null;

  return (
    <div className="post-options-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="post-options-sheet">
        <div className="comments-handle" />
        <div className="post-options-preview">
          <img src={post.imageURL} alt="" />
          <div>
            <p className="post-options-title">{post.childName} anısı</p>
            <p className="post-options-sub">{formatPostDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="post-option-row" onClick={() => onEditFrame(post.id)}>
          <Icon name="photos" />
          <span>Çerçeveyi değiştir</span>
        </button>
        <button className="post-option-row danger" onClick={() => onDelete(post.id)}>
          <Icon name="logout" />
          <span>Anıyı sil</span>
        </button>
        <button className="post-option-cancel" onClick={onClose}>Vazgeç</button>
      </div>
    </div>
  );
}
