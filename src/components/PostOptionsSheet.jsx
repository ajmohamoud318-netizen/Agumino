import Icon from "./Icon";

export default function PostOptionsSheet({ post, open, onClose, onEditFrame, onDelete }) {
  if (!open || !post) return null;

  return (
    <div className="post-options-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ig-options-sheet">
        <div className="ig-options-handle" />

        <button className="ig-option-row" onClick={() => onEditFrame(post.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>Düzenle</span>
        </button>

        <button className="ig-option-row" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <path d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49"/>
          </svg>
          <span>Paylaş</span>
        </button>

        <button className="ig-option-row" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Kaydet</span>
        </button>

        <button className="ig-option-row" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
          <span>Yorumları kapat</span>
        </button>

        <button className="ig-option-row ig-option-danger" onClick={() => onDelete(post.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <span>Sil</span>
        </button>

        <div className="ig-options-gap" />

        <button className="ig-option-cancel" onClick={onClose}>Vazgeç</button>
      </div>
    </div>
  );
}
