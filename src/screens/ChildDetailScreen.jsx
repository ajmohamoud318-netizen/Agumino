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

  const coverPost = childPosts[0];

  return (
    <div className="cd-root">
      {/* Profile header */}
      <div className="cd-header">
        <div className="cd-avatar-ring">
          <div className="cd-avatar-photo">
            <img
              className="cd-avatar-img"
              style={compositionStyle(coverPost.composition)}
              src={coverPost.imageURL}
              alt={childName}
            />
            {coverPost.frameURL && (
              <img className="cd-avatar-frame" src={coverPost.frameURL} alt="" />
            )}
          </div>
        </div>
        <h2 className="cd-name">{childName}</h2>
        <p className="cd-count">{childPosts.length} anı</p>
        <button className="cd-add-btn" onClick={onAddMemory}>
          + Anı Ekle
        </button>
      </div>

      {/* Photo grid */}
      <div className="cd-grid">
        {childPosts.map((post) => (
          <button key={post.id} className="cd-tile" onClick={() => onOpenOptions(post.id)}>
            <img
              className="cd-tile-img"
              style={compositionStyle(post.composition)}
              src={post.imageURL}
              alt=""
            />
            {post.frameURL && (
              <img className="cd-tile-frame" src={post.frameURL} alt="" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
