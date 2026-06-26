import Icon from "./Icon";

const SCREEN_TITLES = { shares: "Albümler", children: "Çocuklar", profile: "Profil", notifications: "Bildirimler" };

export default function TopNav({ screen, childName, onBack, onAdd, onNotifications, onMenu }) {
  const isHome = screen === "home";
  const isProfile = screen === "profile";
  const title = screen === "child-detail" ? childName : (SCREEN_TITLES[screen] ?? "");

  return (
    <nav className="nav">
      {isHome
        ? <button className="icon-button" onClick={onAdd}><Icon name="plus" /></button>
        : <button className="icon-button" onClick={onBack}><Icon name="back" /></button>
      }
      {isHome
        ? <img className="brand-logo" src="/logo.png.png" alt="Agumino" />
        : <span className="nav-title">{title}</span>
      }
      {isProfile
        ? <button className="icon-button" style={{ justifySelf: "end" }} onClick={onMenu}><Icon name="menu" /></button>
        : <button className="icon-button love" onClick={onNotifications}><Icon name="heart" /></button>
      }
    </nav>
  );
}
