import EmptyState from "../components/EmptyState";
import { compositionStyle, formatPostDate } from "../utils/helpers";

export default function ChildDetailScreen({ childName, posts, onAddMemory, onOpenOptions }) {
  const childPosts = posts.filter((post) => post.childName === childName);

  if (childPosts.length === 0) return (
    <div className="empty-hero">
      <img src="/noalbum.png" alt="Henüz anı yok" style={{ width: "88%", maxWidth: 320, display: "block" }} />
      <EmptyState icon="photos" title={`${childName || "Çocuk"} için anı yok`} text="Bu çocuğa ait ilk fotoğrafı eklediğinde burada kendi küçük albümü oluşacak." actionLabel="Anı Ekle" onAction={onAddMemory} />
    </div>
  );

  return (
    <div className="stack">
      <div className="child-album-summary">
        <div className="post-avatar">{childName[0].toUpperCase()}</div>
        <div>
          <p>{childName}</p>
          <span>{childPosts.length} anı</span>
        </div>
      </div>
      <div className="album-grid">
        {childPosts.map((post) => (
          <button key={post.id} className="album-tile" onClick={() => onOpenOptions(post.id)}>
            <div className="album-tile-media">
              <img className="album-tile-photo" style={compositionStyle(post.composition)} src={post.imageURL} alt={`${post.childName} anısı`} />
              {post.frameURL && <img className="album-tile-frame" src={post.frameURL} alt="" />}
            </div>
            <div className="album-tile-meta">
              <span>{post.childName}</span>
              <small>{formatPostDate(post.createdAt)}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
