import Icon from "../components/Icon";

const SETTINGS_ROWS = [
  "Abonelik", "Hesap Bilgileri", "Şifremi Değiştir",
  "Davetliler", "Davet Kodu Kullan", "Engellenen kullanıcılar", "Hesabımı Sil",
];

export default function ProfileScreen({ onLogout }) {
  return (
    <div className="stack">
      <div className="profile-hero">
        <div className="avatar-wrap">
          <div className="avatar-placeholder"><Icon name="user" /></div>
          <div className="avatar-cam"><Icon name="camera" /></div>
        </div>
        <p className="profile-name">Hoş Geldiniz</p>
        <p className="profile-sub">Profilini tamamlayınca aile albümün daha kişisel hissedecek.</p>
      </div>
      <div className="settings-card">
        {SETTINGS_ROWS.map((label, i) => (
          <div key={label} className="settings-row" style={i === SETTINGS_ROWS.length - 1 ? { borderBottom: "none" } : {}}>
            <div className="settings-icon green-soft"><Icon name="user" /></div>
            <span className="settings-label">{label}</span>
            <div className="settings-right">
              {label === "Abonelik" && <span className="pro-badge">PRO</span>}
              <span style={{ color: "var(--muted)", fontSize: 18 }}>›</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onLogout} className="logout-btn">
        <Icon name="logout" />
        Çıkış Yap
      </button>
    </div>
  );
}
