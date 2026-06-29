import Icon from "./Icon";

const TAB_LIST = ["home", "shares", "children", "profile"];
const TAB_ICONS = { home: "home", shares: "photos", profile: "profile" };
const TAB_LABELS = { home: "Anasayfa", shares: "Paylaşımlar", children: "Çocuklar", profile: "Profil" };

export { TAB_LIST };

export default function BottomTabs({ active, onChange }) {
  return (
    <div className="tabs">
      {TAB_LIST.map((tab) => (
        <button key={tab} className={`tab${active === tab ? " active" : ""}`} aria-label={TAB_LABELS[tab]} onClick={() => onChange(tab)}>
          <span className="tab-icon">
            {tab === "children"
              ? <img src="/image.png" alt="Çocuklar" className="tab-child-icon" />
              : <Icon name={TAB_ICONS[tab]} />
            }
          </span>
        </button>
      ))}
    </div>
  );
}
