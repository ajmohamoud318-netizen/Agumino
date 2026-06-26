import Icon from "./Icon";

const LEGAL_ITEMS = [
  "Gizlilik Politikası", "Kullanım Koşulları", "KVKK",
  "Çerez Politikası", "Açık Rıza", "Mesafeli Satış Sözleşmesi",
  "Teslimat ve İade Koşulları",
];

export default function Drawer({ open, onClose }) {
  return (
    <div className={`drawer-overlay${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <button className="drawer-close" onClick={onClose}>✕</button>
        <div className="drawer-profile">
          <div className="drawer-avatar"><Icon name="user" /></div>
          <p className="drawer-name">Kullanıcı Adı</p>
          <span className="free-badge">Free</span>
        </div>
        <div className="drawer-premium">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, color: "var(--green)" }}><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" /></svg>
          <span className="drawer-premium-label">Premium</span>
          <div className="drawer-premium-right"><span className="pro-badge">PRO</span>›</div>
        </div>
        <p className="drawer-section-label">Yasal</p>
        {LEGAL_ITEMS.map((label) => (
          <div key={label} className="drawer-row">
            <Icon name="doc" style={{ width: 18, height: 18, color: "var(--muted)" }} />
            <span className="drawer-row-label">{label}</span>
            <span className="drawer-ext">↗</span>
          </div>
        ))}
        <p className="drawer-version">Agumino v1.0.0</p>
      </div>
    </div>
  );
}
