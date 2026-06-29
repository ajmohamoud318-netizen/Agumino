import EmptyState from "../components/EmptyState";
import { compositionStyle } from "../utils/helpers";

function calcAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) years--;
  if (years < 1) {
    let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) months--;
    return months <= 0 ? "Yenidoğan" : `${months} aylık`;
  }
  return `${years} yaşında`;
}

export default function ChildrenScreen({ childrenList, posts, onAddChild, onChildTap }) {
  if (childrenList.length === 0) return (
    <div className="stack">
      <EmptyState icon="kid" title="Çocuk profili yok" text="Her çocuk için ayrı anılar, çerçeveler ve küçük bir aile zaman çizgisi tutabilirsin." actionLabel="Çocuk Ekle" onAction={onAddChild} />
    </div>
  );

  return (
    <div className="chl-root">
      {childrenList.map((child, i) => {
        const childPosts = posts.filter((p) => p.childName === child.name);
        const cover = childPosts[0] || null;
        const age = calcAge(child.birthDate);

        return (
          <button key={i} className="chl-row" onClick={() => onChildTap(child)}>
            {/* Circle avatar */}
            <div className="chl-avatar-ring">
              <div className="chl-avatar">
                {cover ? (
                  <>
                    <img
                      className="chl-avatar-img"
                      style={compositionStyle(cover.composition)}
                      src={cover.imageURL}
                      alt={child.name}
                    />
                    {cover.frameURL && (
                      <img className="chl-avatar-frame" src={cover.frameURL} alt="" />
                    )}
                  </>
                ) : (
                  <div className="chl-avatar-initial">{child.name[0].toUpperCase()}</div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="chl-row-info">
              <span className="chl-row-name">{child.name}</span>
              <span className="chl-row-sub">
                {age ? age : `${childPosts.length} anı`}
              </span>
            </div>

            {/* Chevron */}
            <svg className="chl-row-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        );
      })}

      <button className="chl-add-row" onClick={onAddChild}>
        <div className="chl-add-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <span className="chl-add-label">Çocuk Ekle</span>
      </button>
    </div>
  );
}
