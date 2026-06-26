import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";

export default function ChildrenScreen({ childrenList, posts, onAddChild, onChildTap }) {
  return (
    <div className="stack">
      {childrenList.length === 0 && (
        <EmptyState icon="kid" title="Çocuk profili yok" text="Her çocuk için ayrı anılar, çerçeveler ve küçük bir aile zaman çizgisi tutabilirsin." actionLabel="Çocuk Ekle" onAction={onAddChild} />
      )}
      {childrenList.map((child, i) => (
        <article key={i} className="row" style={{ cursor: "pointer" }} onClick={() => onChildTap(child)}>
          <div className="tile-icon green-soft"><Icon name="kid" /></div>
          <div>
            <div className="row-title">{child}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              {posts.filter((post) => post.childName === child).length} anı
            </div>
          </div>
          <div className="chevron">›</div>
        </article>
      ))}
      <button className="action" onClick={onAddChild} style={{ justifySelf: "center", fontSize: 16, minHeight: 44, padding: "0 22px", borderRadius: 14, gap: 10 }}>
        <Icon name="kid" />
        Çocuk Ekle
      </button>
    </div>
  );
}
