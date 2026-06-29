import EmptyState from "../components/EmptyState";
import PostCard from "../components/PostCard";

export default function HomeScreen({ homeState, posts, onAddChild, onAddMemory, onToggleLike, onOpenComments, onOpenOptions }) {
  if (homeState === "no-child") return (
    <div className="stack">
      <div className="empty-hero">
        <img src="/nochildsaved.png" alt="Henüz çocuk eklenmedi" style={{ width: "100%", borderRadius: 20, display: "block" }} />
        <EmptyState icon="kid" title="Birlikte güzel anılar biriktirelim!" text="Başlamak için çocuğunu ekle. Albüm, paylaşımlar ve aile akışı onun etrafında şekillenecek." actionLabel="Çocuk Ekle" onAction={onAddChild} />
      </div>
    </div>
  );

  if (homeState === "no-album") return (
    <div className="stack">
      <div className="empty-hero">
        <img src="/noalbum.png" alt="Henüz anı yok" style={{ width: "88%", maxWidth: 320, display: "block" }} />
        <EmptyState icon="photos" title="İlk anını paylaş" text="Bir fotoğraf seç, çerçeveni ayarla ve aile akışını başlat." actionLabel="Anı Ekle" onAction={onAddMemory} />
      </div>
    </div>
  );

  return (
    <div className="stack">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} onToggleLike={onToggleLike} onOpenComments={onOpenComments} onOpenOptions={onOpenOptions} />
        ))}
      </div>
    </div>
  );
}
