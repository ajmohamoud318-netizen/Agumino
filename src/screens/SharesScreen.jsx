import EmptyState from "../components/EmptyState";
import { compositionStyle } from "../utils/helpers";

export default function SharesScreen({ posts, onOpenChild }) {
  if (posts.length === 0) return (
    <div className="stack">
      <EmptyState icon="photos" title="Paylaşım yok" text="İlk anını eklediğinde aile akışın burada canlı bir feed gibi görünür." />
    </div>
  );

  const albums = Object.values(
    posts.reduce((groups, post) => {
      const key = post.childName;
      groups[key] = groups[key] || { childName: key, posts: [] };
      groups[key].posts.push(post);
      return groups;
    }, {})
  ).map((album) => {
    const seed = [...album.childName].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const cover = album.posts[seed % album.posts.length];
    return { ...album, cover };
  });

  return (
    <div className="stack">
      <div className="feed-summary">
        <div>
          <p className="feed-summary-title">Çocuk albümleri</p>
          <p className="feed-summary-sub">{albums.length} albüm, {posts.length} anı</p>
        </div>
        <div className="feed-summary-avatars">
          {albums.slice(0, 3).map((album) => (
            <span key={album.childName}>{album.childName[0].toUpperCase()}</span>
          ))}
        </div>
      </div>
      <div className="album-highlight-grid">
        {albums.map((album) => (
          <button key={album.childName} className="album-highlight" onClick={() => onOpenChild(album.childName)}>
            <div className="album-highlight-ring">
              <div className="album-highlight-cover">
                <img className="album-highlight-photo" style={compositionStyle(album.cover.composition)} src={album.cover.imageURL} alt={`${album.childName} albümü`} />
                {album.cover.frameURL && <img className="album-highlight-frame" src={album.cover.frameURL} alt="" />}
              </div>
            </div>
            <span className="album-highlight-name">{album.childName}</span>
            <small className="album-highlight-count">{album.posts.length} anı</small>
          </button>
        ))}
      </div>
    </div>
  );
}
