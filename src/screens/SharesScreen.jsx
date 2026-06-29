import EmptyState from "../components/EmptyState";
import { compositionStyle } from "../utils/helpers";

export default function SharesScreen({ posts, onOpenChild }) {
  if (posts.length === 0) return (
    <div className="stack">
      <EmptyState icon="photos" title="Henüz anı yok" text="İlk anını eklediğinde albümlerin burada belirir." />
    </div>
  );

  const albums = Object.values(
    posts.reduce((groups, post) => {
      const key = post.childName;
      groups[key] = groups[key] || { childName: key, posts: [] };
      groups[key].posts.push(post);
      return groups;
    }, {})
  ).map((album) => ({ ...album, cover: album.posts[0] }));

  return (
    <div className="alb-root">
      <div className="alb-header">
        <span className="alb-header-title">Albümler</span>
        <span className="alb-header-sub">{albums.length} çocuk &middot; {posts.length} anı</span>
      </div>

      <div className="alb-grid">
        {albums.map((album) => (
          <button key={album.childName} className="alb-card" onClick={() => onOpenChild(album.childName)}>
            <div className="alb-card-photo">
              <img
                className="alb-card-img"
                style={compositionStyle(album.cover.composition)}
                src={album.cover.imageURL}
                alt={album.childName}
              />
              {album.cover.frameURL && (
                <img className="alb-card-frame" src={album.cover.frameURL} alt="" />
              )}
            </div>
            <div className="alb-card-meta">
              <span className="alb-card-name">{album.childName}</span>
              <span className="alb-card-count">{album.posts.length} anı</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
