import { useEffect, useRef, useState } from "react";

const STORAGE_KEYS = {
  children: "agumino.children",
  posts: "agumino.posts",
};

const DEFAULT_COMPOSITION = { x: 0, y: 0, scale: 1 };

const loadStoredArray = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const loadStoredPosts = () => loadStoredArray(STORAGE_KEYS.posts).map((post, index) => ({
  ...post,
  id: post.id || `saved-${index}-${post.childName || "post"}`,
  composition: post.composition || DEFAULT_COMPOSITION,
  createdAt: post.createdAt || new Date().toISOString(),
  liked: Boolean(post.liked),
  likeCount: post.likeCount ?? 1,
  comments: post.comments || [],
}));

const saveStoredArray = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Agumino could not save locally:", error);
  }
};

const makePostId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatPostDate = (createdAt) => {
  if (!createdAt) return "Az önce";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(createdAt));
};

const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const preparePhotoForStorage = async (file) => {
  const src = await readFileAsDataURL(file);
  const image = new Image();
  image.src = src;
  await image.decode();

  const maxSide = 1440;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  if (scale === 1) return src;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.88);
};

const compositionStyle = (composition = DEFAULT_COMPOSITION) => ({
  transform: `translate(${composition.x}%, ${composition.y}%) scale(${composition.scale})`,
});

const passwordRules = [
  { key: "length", label: "En az 8 karakter", test: (value) => value.length >= 8 },
  { key: "upper", label: "En az 1 büyük harf", test: (value) => /[A-ZÇĞİÖŞÜ]/.test(value) },
  { key: "lower", label: "En az 1 küçük harf", test: (value) => /[a-zçğıöşü]/.test(value) },
  { key: "number", label: "En az 1 rakam", test: (value) => /\d/.test(value) },
];

/* ── LoginScreen ───────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const signupInputRefs = useRef([]);
  const loginInputRefs = useRef([]);
  const passwordChecks = passwordRules.map((rule) => ({ ...rule, passed: rule.test(password) }));
  const passwordIsValid = passwordChecks.every((rule) => rule.passed);
  const passwordsMatch = password.length > 0 && password === repeatPassword;

  const focusSignupInput = (index) => {
    signupInputRefs.current[index]?.focus();
  };

  const handleSignupKeyDown = (e, nextIndex) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (nextIndex === "submit") {
      e.currentTarget.form?.requestSubmit();
      return;
    }
    focusSignupInput(nextIndex);
  };

  const handleLoginKeyDown = (e, nextIndex) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (nextIndex === "submit") {
      e.currentTarget.form?.requestSubmit();
      return;
    }
    loginInputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Lütfen tüm alanları doldurun."); return; }
    if (mode === "signup" && (!name || !surname || !birthDate || !repeatPassword)) { setError("Lütfen tüm zorunlu alanları doldurun."); return; }
    if (mode === "signup" && !passwordIsValid) { setError("Lütfen şifre koşullarını tamamlayın."); return; }
    if (mode === "signup" && password !== repeatPassword) { setError("Şifreler eşleşmiyor."); return; }
    setError("");
    onLogin();
  };

  return (
    <div className="login-screen">
      <div className={`login-card${mode === "signup" ? " signup-card" : ""}`}>
        <div className="login-logo-wrap">
          <img className="login-logo" src="/logo.png.png" alt="Agumino" />
        </div>
        {mode === "login" && <h1 className="login-title">Tekrar hoş geldin</h1>}
        {mode === "login" && <p className="login-sub">Aile albümüne devam et</p>}
        <form className={`login-form${mode === "signup" ? " signup-form" : ""}`} onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <>
              <p className="signup-section-title">Kişisel Bilgiler</p>
              <div className="signup-two-col">
                <div className="signup-field compact">
                  <input ref={(el) => { signupInputRefs.current[0] = el; }} type="text" placeholder="Ebeveyn Adı" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 1)} autoComplete="given-name" enterKeyHint="next" />
                </div>
                <div className="signup-field compact">
                  <input ref={(el) => { signupInputRefs.current[1] = el; }} type="text" placeholder="Ebeveyn Soyadı" value={surname} onChange={(e) => setSurname(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 2)} autoComplete="family-name" enterKeyHint="next" />
                </div>
              </div>
              <div className="signup-field with-icon">
                <Icon name="mail" />
                <input ref={(el) => { signupInputRefs.current[2] = el; }} type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 3)} autoComplete="email" enterKeyHint="next" />
              </div>
              <div className="signup-field with-trailing-icon">
                <input ref={(el) => { signupInputRefs.current[3] = el; }} type="text" placeholder="Ebeveyn Doğum Tarihi" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 4)} autoComplete="bday" enterKeyHint="next" />
                <Icon name="calendar" />
              </div>
              <p className="signup-section-title">Hesap Güvenliği</p>
              <div className="signup-field with-icon with-trailing-icon">
                <Icon name="lock" />
                <input ref={(el) => { signupInputRefs.current[4] = el; }} type={showPassword ? "text" : "password"} placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 5)} autoComplete="new-password" enterKeyHint="next" />
                <button className="signup-icon-button" type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Şifreyi göster">
                  <Icon name="eye" />
                </button>
              </div>
              <div className="signup-field with-icon with-trailing-icon">
                <Icon name="lock" />
                <input ref={(el) => { signupInputRefs.current[5] = el; }} type={showRepeatPassword ? "text" : "password"} placeholder="Şifre Tekrar" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 6)} autoComplete="new-password" enterKeyHint="next" />
                <button className="signup-icon-button" type="button" onClick={() => setShowRepeatPassword((value) => !value)} aria-label="Şifre tekrarını göster">
                  <Icon name="eye" />
                </button>
              </div>
              <div className="password-rules">
                <p className="password-rules-title">Şifre koşulları</p>
                {passwordChecks.map((rule) => (
                  <div key={rule.key} className={`password-rule${rule.passed ? " passed" : ""}`}>
                    <span>{rule.passed ? "✓" : "•"}</span>
                    {rule.label}
                  </div>
                ))}
                <div className={`password-rule${passwordsMatch ? " passed" : ""}`}>
                  <span>{passwordsMatch ? "✓" : "•"}</span>
                  Şifreler eşleşiyor
                </div>
              </div>
              <p className="signup-section-title">İsteğe Bağlı</p>
              <div className="signup-field">
                <input ref={(el) => { signupInputRefs.current[6] = el; }} type="text" placeholder="Davet Kodu" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, "submit")} enterKeyHint="done" />
              </div>
            </>
          ) : (
            <>
              <div className="login-field">
                <label className="login-label">E-posta</label>
                <input ref={(el) => { loginInputRefs.current[0] = el; }} className="login-input" type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => handleLoginKeyDown(e, 1)} autoComplete="email" enterKeyHint="next" />
              </div>
              <div className="login-field">
                <label className="login-label">Şifre</label>
                <input ref={(el) => { loginInputRefs.current[1] = el; }} className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleLoginKeyDown(e, "submit")} autoComplete="current-password" enterKeyHint="done" />
              </div>
              <div className="login-options">
                <label className="remember-row">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>Beni hatırla</span>
                </label>
                <button className="forgot-link" type="button" onClick={() => setError("Şifre sıfırlama bağlantısı e-postana gönderilecek.")}>Şifremi unuttum</button>
              </div>
            </>
          )}
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit">{mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</button>
        </form>
        <div className="login-switch">
          {mode === "login" ? (
            <span>Hesabın yok mu? <button className="login-link" onClick={() => { setMode("signup"); setError(""); }}>Kayıt ol</button></span>
          ) : (
            <span>Zaten hesabın var mı? <button className="login-link" onClick={() => { setMode("login"); setError(""); }}>Giriş yap</button></span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */
function Icon({ name, style }) {
  const s = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", style };
  if (name === "home") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M3.5 11.2 12 4l8.5 7.2v8.1a1.7 1.7 0 0 1-1.7 1.7h-4.2v-5.7H9.4V21H5.2a1.7 1.7 0 0 1-1.7-1.7v-8.1Z" /></svg>;
  if (name === "photos") return <svg {...s} strokeWidth="2.2"><path d="M5 7.4v10.8a1.8 1.8 0 0 0 1.8 1.8h10.8" /><rect x="8" y="4" width="11.5" height="11.5" rx="2" /><path d="m9.8 14 3.1-3.5 2.2 2.5 1.4-1.6 3 3.4" /><circle cx="12.2" cy="7.7" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (name === "kid") return <svg {...s} strokeWidth="2.1"><circle cx="12" cy="12" r="5.8" /><circle cx="5.8" cy="12" r="1.8" /><circle cx="18.2" cy="12" r="1.8" /><path d="M9.6 11h.01M14.4 11h.01M9.8 14.4c1.3 1 3.1 1 4.4 0" /></svg>;
  if (name === "profile") return <svg {...s} strokeWidth="2.2"><circle cx="12" cy="8.2" r="3.4" /><path d="M5.4 20c.8-3.8 3.3-5.7 6.6-5.7s5.8 1.9 6.6 5.7" /></svg>;
  if (name === "heart") return <svg {...s} strokeWidth="2.2"><path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" /></svg>;
  if (name === "plus") return <svg {...s} strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "mail") return <svg {...s} strokeWidth="2.2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "calendar") return <svg {...s} strokeWidth="2.2"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
  if (name === "lock") return <svg {...s} strokeWidth="2.2"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 15v2" /></svg>;
  if (name === "eye") return <svg {...s} strokeWidth="2.2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (name === "back") return <svg {...s} strokeWidth="2.4"><path d="M15 18l-6-6 6-6" /></svg>;
  if (name === "menu") return <svg {...s} strokeWidth="2.4"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
  if (name === "user") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM5 21a7 7 0 0 1 14 0H5Z" /></svg>;
  if (name === "camera") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 7h-2.7l-1.2-2H7.9L6.7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" /></svg>;
  if (name === "logout") return <svg {...s} strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
  if (name === "bell") return <svg {...s} strokeWidth="1.5"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
  if (name === "dots") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>;
  if (name === "shield") return <svg {...s} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>;
  if (name === "doc") return <svg {...s} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
  return null;
}

/* ── TopNav ─────────────────────────────────────────────────────── */
const SCREEN_TITLES = { shares: "Albümler", children: "Çocuklar", profile: "Profil", notifications: "Bildirimler" };

function TopNav({ screen, childName, onBack, onAdd, onNotifications, onMenu }) {
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

/* ── Drawer ─────────────────────────────────────────────────────── */
const LEGAL_ITEMS = ["Gizlilik Politikası", "Kullanım Koşulları", "KVKK", "Çerez Politikası", "Açık Rıza", "Mesafeli Satış Sözleşmesi", "Teslimat ve İade Koşulları"];

function Drawer({ open, onClose }) {
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

/* ── PostCard ───────────────────────────────────────────────────── */
function PostCard({ id, childName, imageURL, frameURL, composition, createdAt, liked, likeCount = 1, comments = [], onToggleLike, onOpenComments, onOpenOptions }) {
  const commentCount = comments.length;
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">{childName[0].toUpperCase()}</div>
        <div className="post-meta">
          <div className="post-name">{childName}</div>
          <div className="post-time">{formatPostDate(createdAt)}</div>
        </div>
        {frameURL && <img className="post-frame-mini" src={frameURL} alt="" />}
        <button className="post-menu-btn" onClick={() => onOpenOptions(id)} aria-label="Anı seçenekleri">
          <Icon name="dots" style={{ width: 20, height: 20, color: "var(--muted)" }} />
        </button>
      </div>
      <div className="post-media">
        <img className="post-photo" style={compositionStyle(composition)} src={imageURL} alt={`${childName} anısı`} />
        {frameURL && <img className="post-frame-overlay" src={frameURL} alt="" />}
      </div>
      <div className="post-actions">
        <button className={`post-action-btn${liked ? " liked" : ""}`} onClick={() => onToggleLike(id)} aria-label="Beğen">
          <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" /></svg>
        </button>
        <button className="post-action-btn" onClick={() => onOpenComments(id)} aria-label="Yorum yap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </button>
        <button className="post-action-btn" aria-label="Paylaş">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7Z" /></svg>
        </button>
      </div>
      <div className="post-stats">
        <span>{likeCount} beğeni</span>
        <button className="post-comments-link" onClick={() => onOpenComments(id)}>{commentCount} yorum</button>
      </div>
      <div className="post-caption">
        <strong>{childName}</strong>
        <span> yeni bir anı paylaştı.</span>
      </div>
      {commentCount > 0 && (
        <button className="post-preview-comment" onClick={() => onOpenComments(id)}>
          <strong>{comments[commentCount - 1].author}</strong>
          <span> {comments[commentCount - 1].text}</span>
        </button>
      )}
      <div className="post-activity">Aile albümüne eklendi</div>
    </div>
  );
}

function EmptyState({ icon, title, text, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name={icon} /></div>
      <h2>{title}</h2>
      <p>{text}</p>
      {actionLabel && (
        <button className="action empty-action" onClick={onAction}>
          <Icon name="plus" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ── HomeScreen ─────────────────────────────────────────────────── */
function HomeScreen({ homeState, posts, onAddChild, onAddMemory, onToggleLike, onOpenComments, onOpenOptions }) {
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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {posts.map((post) => <PostCard key={post.id} {...post} onToggleLike={onToggleLike} onOpenComments={onOpenComments} onOpenOptions={onOpenOptions} />)}
      </div>
    </div>
  );
}

/* ── SharesScreen ───────────────────────────────────────────────── */
function SharesScreen({ posts, onOpenChild }) {
  if (posts.length > 0) {
    const albums = Object.values(posts.reduce((groups, post) => {
      const key = post.childName;
      groups[key] = groups[key] || { childName: key, posts: [] };
      groups[key].posts.push(post);
      return groups;
    }, {})).map((album) => {
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

  return (
    <div className="stack">
      <EmptyState icon="photos" title="Paylaşım yok" text="İlk anını eklediğinde aile akışın burada canlı bir feed gibi görünür." />
    </div>
  );
}

/* ── ChildrenScreen ─────────────────────────────────────────────── */
function ChildrenScreen({ childrenList, posts, onAddChild, onChildTap }) {
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

/* ── ProfileScreen ──────────────────────────────────────────────── */
const SETTINGS_ROWS = [
  "Abonelik", "Hesap Bilgileri", "Şifremi Değiştir",
  "Davetliler", "Davet Kodu Kullan", "Engellenen kullanıcılar", "Hesabımı Sil"
];

function ProfileScreen({ onLogout }) {
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

/* ── ChildDetailScreen ──────────────────────────────────────────── */
function ChildDetailScreen({ childName, posts, onAddMemory, onOpenOptions }) {
  const childPosts = posts.filter((post) => post.childName === childName);

  if (childPosts.length === 0) {
    return (
      <div className="empty-hero">
        <img src="/noalbum.png" alt="Henüz anı yok" style={{ width: "88%", maxWidth: 320, display: "block" }} />
        <EmptyState icon="photos" title={`${childName || "Çocuk"} için anı yok`} text="Bu çocuğa ait ilk fotoğrafı eklediğinde burada kendi küçük albümü oluşacak." actionLabel="Anı Ekle" onAction={onAddMemory} />
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="child-album-summary">
        <div className="post-avatar">{childName[0].toUpperCase()}</div>
        <div>
          <p>{childName}</p>
          <span>{childPosts.length} anı</span>
        </div>
      </div>
      <div className="album-grid">
        {childPosts.map((post) => (
          <button key={post.id} className="album-tile" onClick={() => onOpenOptions(post.id)}>
            <div className="album-tile-media">
              <img className="album-tile-photo" style={compositionStyle(post.composition)} src={post.imageURL} alt={`${post.childName} anısı`} />
              {post.frameURL && <img className="album-tile-frame" src={post.frameURL} alt="" />}
            </div>
            <div className="album-tile-meta">
              <span>{post.childName}</span>
              <small>{formatPostDate(post.createdAt)}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── NotificationsScreen ────────────────────────────────────────── */
function NotificationsScreen() {
  return (
    <div className="stack">
      <EmptyState icon="bell" title="Henüz bildirim yok" text="Beğeniler, yorumlar ve aile davetleri burada görünecek." />
    </div>
  );
}

/* ── FramePicker ────────────────────────────────────────────────── */
const FRAMES = [
  { label: "Yok", value: "" },
  { label: "Agumino 1", value: "/agumino1.png" },
  { label: "Agumino 2", value: "/agumino2.png" },
  { label: "Bebeğim", value: "/bebegim3.png" },
];

function FramePicker({ open, imageURL, initialFrameURL = "", initialComposition = DEFAULT_COMPOSITION, onConfirm, onClose }) {
  const [selected, setSelected] = useState(initialFrameURL);
  const [composition, setComposition] = useState(initialComposition);
  const previewRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSelected(initialFrameURL);
      setComposition(initialComposition);
      dragRef.current = null;
    }
  }, [open, imageURL, initialFrameURL, initialComposition]);

  const handlePointerDown = (e) => {
    if (!previewRef.current) return;
    previewRef.current.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startComposition: composition,
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    setComposition({
      ...dragRef.current.startComposition,
      x: Math.max(-35, Math.min(35, dragRef.current.startComposition.x + dx)),
      y: Math.max(-35, Math.min(35, dragRef.current.startComposition.y + dy)),
    });
  };

  const handlePointerUp = (e) => {
    if (previewRef.current?.hasPointerCapture(e.pointerId)) {
      previewRef.current.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  };

  const selectedFrame = FRAMES.find((frame) => frame.value === selected);

  if (!open) return null;
  return (
    <div className="frame-picker open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="frame-picker-sheet">
        <p className="frame-picker-title">Çerçeve seç</p>
        <p className="frame-picker-subtitle">{selectedFrame?.value ? selectedFrame.label : "Çerçevesiz paylaşım"}</p>
        <div
          ref={previewRef}
          className="frame-preview-wrap"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img className="frame-preview-photo" style={compositionStyle(composition)} src={imageURL} alt="" draggable="false" />
          {selected && <img className="frame-preview-overlay visible" src={selected} alt="" />}
        </div>
        <div className="frame-controls">
          <label className="frame-control-label" htmlFor="frame-zoom">Yakınlaştır</label>
          <input
            id="frame-zoom"
            className="frame-range"
            type="range"
            min="1"
            max="2.4"
            step="0.05"
            value={composition.scale}
            onChange={(e) => setComposition((prev) => ({ ...prev, scale: Number(e.target.value) }))}
          />
          <button className="frame-reset" onClick={() => setComposition(DEFAULT_COMPOSITION)}>Sıfırla</button>
        </div>
        <div className="frame-thumbs" aria-label="Çerçeveler">
          {FRAMES.map((f) => (
            <button key={f.value || "none"} className={`frame-thumb${!f.value ? " none-thumb" : ""}${selected === f.value ? " selected" : ""}`} onClick={() => setSelected(f.value)}>
              {!f.value ? <span className="frame-thumb-none">{f.label}</span> : <img src={f.value} alt={f.label} />}
              <span className="frame-thumb-label">{f.label}</span>
            </button>
          ))}
        </div>
        <button className="frame-confirm" onClick={() => { onConfirm(selected, composition); setSelected(""); }}>Devam Et →</button>
      </div>
    </div>
  );
}

/* ── ChildPicker ────────────────────────────────────────────────── */
function ChildPicker({ open, childrenList, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="child-picker open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="child-picker-sheet">
        <p className="child-picker-title">Hangi çocuk için?</p>
        <div className="child-picker-list">
          {childrenList.map((name) => (
            <button key={name} className="child-picker-row" onClick={() => onSelect(name)}>
              <div className="child-picker-row-avatar">{name[0].toUpperCase()}</div>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AddChildSheet ──────────────────────────────────────────────── */
function AddChildSheet({ open, onClose, onAdd }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return;
    onAdd(value);
    onClose();
  };

  return (
    <div className="add-child-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="add-child-sheet" onSubmit={submit}>
        <div className="comments-handle" />
        <p className="add-child-title">Çocuk ekle</p>
        <p className="add-child-sub">Anıları düzenlemek için küçük bir profil oluştur.</p>
        <label className="login-label" htmlFor="child-name">Çocuğun adı</label>
        <input
          id="child-name"
          className="login-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn. Deniz"
          autoFocus
        />
        <div className="add-child-actions">
          <button className="add-child-secondary" type="button" onClick={onClose}>Vazgeç</button>
          <button className="add-child-primary" type="submit" disabled={!name.trim()}>Ekle</button>
        </div>
      </form>
    </div>
  );
}

/* ── CommentsSheet ──────────────────────────────────────────────── */
function CommentsSheet({ post, open, onClose, onAddComment }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) setText("");
  }, [open, post?.id]);

  if (!open || !post) return null;

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAddComment(post.id, value);
    setText("");
  };

  return (
    <div className="comments-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="comments-sheet">
        <div className="comments-handle" />
        <div className="comments-header">
          <p className="comments-title">Yorumlar</p>
          <button className="comments-close" onClick={onClose}>✕</button>
        </div>
        <div className="comments-post-line">
          <div className="post-avatar small">{post.childName[0].toUpperCase()}</div>
          <div>
            <div className="post-name">{post.childName}</div>
            <div className="post-time">{formatPostDate(post.createdAt)}</div>
          </div>
        </div>
        <div className="comments-list">
          {post.comments.length === 0 ? (
            <p className="comments-empty">İlk yorumu sen yaz.</p>
          ) : post.comments.map((comment) => (
            <div key={comment.id} className="comment-row">
              <div className="comment-avatar">{comment.author[0].toUpperCase()}</div>
              <div className="comment-bubble">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-time">{formatPostDate(comment.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
        <form className="comment-form" onSubmit={submit}>
          <input className="comment-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Yorum ekle..." />
          <button className="comment-submit" type="submit" disabled={!text.trim()}>Paylaş</button>
        </form>
      </div>
    </div>
  );
}

/* ── PostOptionsSheet ───────────────────────────────────────────── */
function PostOptionsSheet({ post, open, onClose, onEditFrame, onDelete }) {
  if (!open || !post) return null;

  return (
    <div className="post-options-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="post-options-sheet">
        <div className="comments-handle" />
        <div className="post-options-preview">
          <img src={post.imageURL} alt="" />
          <div>
            <p className="post-options-title">{post.childName} anısı</p>
            <p className="post-options-sub">{formatPostDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="post-option-row" onClick={() => onEditFrame(post.id)}>
          <Icon name="photos" />
          <span>Çerçeveyi değiştir</span>
        </button>
        <button className="post-option-row danger" onClick={() => onDelete(post.id)}>
          <Icon name="logout" />
          <span>Anıyı sil</span>
        </button>
        <button className="post-option-cancel" onClick={onClose}>Vazgeç</button>
      </div>
    </div>
  );
}

/* ── BottomTabs ─────────────────────────────────────────────────── */
const TAB_LIST = ["home", "shares", "children", "profile"];
const TAB_ICONS = { home: "home", shares: "photos", children: "kid", profile: "profile" };
const TAB_LABELS = { home: "Anasayfa", shares: "Paylaşımlar", children: "Çocuklar", profile: "Profil" };

function BottomTabs({ active, onChange }) {
  return (
    <div className="tabs">
      {TAB_LIST.map((tab) => (
        <button key={tab} className={`tab${active === tab ? " active" : ""}`} aria-label={TAB_LABELS[tab]} onClick={() => onChange(tab)}>
          <span className="tab-icon"><Icon name={TAB_ICONS[tab]} /></span>
        </button>
      ))}
    </div>
  );
}

/* ── App ────────────────────────────────────────────────────────── */
const ALL_SCREENS = ["home", "shares", "children", "profile", "child-detail", "notifications"];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenHistory, setScreenHistory] = useState(["home"]);
  const [childrenList, setChildrenList] = useState(() => loadStoredArray(STORAGE_KEYS.children));
  const [posts, setPosts] = useState(loadStoredPosts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [framePickerOpen, setFramePickerOpen] = useState(false);
  const [childPickerOpen, setChildPickerOpen] = useState(false);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [pendingImageURL, setPendingImageURL] = useState(null);
  const [pendingFrameURL, setPendingFrameURL] = useState("");
  const [pendingComposition, setPendingComposition] = useState(DEFAULT_COMPOSITION);
  const [activeChildName, setActiveChildName] = useState("");
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [optionsPostId, setOptionsPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const photoInputRef = useRef(null);

  const activeScreen = screenHistory[screenHistory.length - 1];
  const homeState = childrenList.length === 0 ? "no-child" : posts.length === 0 ? "no-album" : "feed";
  const commentsPost = posts.find((post) => post.id === commentsPostId) || null;
  const optionsPost = posts.find((post) => post.id === optionsPostId) || null;
  const editingPost = posts.find((post) => post.id === editingPostId) || null;
  const push = (name) => setScreenHistory((h) => [...h, name]);
  const goBack = () => setScreenHistory((h) => h.length > 1 ? h.slice(0, -1) : h);
  const showTab = (name) => setScreenHistory([name]);

  useEffect(() => {
    saveStoredArray(STORAGE_KEYS.children, childrenList);
  }, [childrenList]);

  useEffect(() => {
    saveStoredArray(STORAGE_KEYS.posts, posts);
  }, [posts]);

  const addChild = () => setAddChildOpen(true);

  const saveChild = (name) => {
    setChildrenList((prev) => [...prev, name]);
  };

  const openPhotoPicker = () => {
    if (childrenList.length === 0) { push("children"); return; }
    photoInputRef.current.value = "";
    photoInputRef.current.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageURL = await preparePhotoForStorage(file);
      setPendingImageURL(imageURL);
      setPendingComposition(DEFAULT_COMPOSITION);
      setFramePickerOpen(true);
    } catch {
      alert("Fotoğraf yüklenemedi. Lütfen başka bir fotoğraf deneyin.");
    }
  };

  const handleFrameConfirm = (frameURL, composition) => {
    if (editingPostId) {
      setPosts((prev) => prev.map((post) => post.id === editingPostId ? { ...post, frameURL, composition } : post));
      setEditingPostId(null);
      setFramePickerOpen(false);
      return;
    }

    setPendingFrameURL(frameURL);
    setPendingComposition(composition);
    setFramePickerOpen(false);
    if (childrenList.length === 1) {
      createPost(childrenList[0], pendingImageURL, frameURL, composition);
    } else {
      setChildPickerOpen(true);
    }
  };

  const createPost = (childName, imgURL, frameURL, composition) => {
    setPosts((prev) => [{
      id: makePostId(),
      childName,
      imageURL: imgURL,
      frameURL,
      composition,
      liked: false,
      likeCount: 1,
      comments: [],
      createdAt: new Date().toISOString(),
    }, ...prev]);
    showTab("home");
  };

  const togglePostLike = (postId) => {
    setPosts((prev) => prev.map((post) => {
      if (post.id !== postId) return post;
      const liked = !post.liked;
      const currentCount = post.likeCount ?? 1;
      return {
        ...post,
        liked,
        likeCount: Math.max(0, currentCount + (liked ? 1 : -1)),
      };
    }));
  };

  const addPostComment = (postId, text) => {
    setPosts((prev) => prev.map((post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: [
          ...(post.comments || []),
          {
            id: makePostId(),
            author: "Kullanıcı",
            text,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }));
  };

  const editPostFrame = (postId) => {
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    setOptionsPostId(null);
    setEditingPostId(postId);
    setPendingImageURL(post.imageURL);
    setPendingFrameURL(post.frameURL || "");
    setPendingComposition(post.composition || DEFAULT_COMPOSITION);
    setFramePickerOpen(true);
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    if (commentsPostId === postId) setCommentsPostId(null);
    if (editingPostId === postId) setEditingPostId(null);
    setOptionsPostId(null);
  };

  const closeFramePicker = () => {
    setFramePickerOpen(false);
    setEditingPostId(null);
  };

  if (!loggedIn) {
    return (
      <div className="phone">
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="phone">
      <TopNav
        screen={activeScreen}
        childName={activeChildName}
        onBack={goBack}
        onAdd={openPhotoPicker}
        onNotifications={() => push("notifications")}
        onMenu={() => setDrawerOpen(true)}
      />
      <main>
        {ALL_SCREENS.map((name) => (
          <section key={name} className={`screen${activeScreen === name ? " active" : ""}`} data-screen={name}>
            {name === "home" && <HomeScreen homeState={homeState} posts={posts} onAddChild={addChild} onAddMemory={openPhotoPicker} onToggleLike={togglePostLike} onOpenComments={setCommentsPostId} onOpenOptions={setOptionsPostId} />}
            {name === "shares" && <SharesScreen posts={posts} onOpenChild={(child) => { setActiveChildName(child); push("child-detail"); }} />}
            {name === "children" && <ChildrenScreen childrenList={childrenList} posts={posts} onAddChild={addChild} onChildTap={(child) => { setActiveChildName(child); push("child-detail"); }} />}
            {name === "profile" && <ProfileScreen onLogout={() => setLoggedIn(false)} />}
            {name === "child-detail" && <ChildDetailScreen childName={activeChildName} posts={posts} onAddMemory={openPhotoPicker} onOpenOptions={setOptionsPostId} />}
            {name === "notifications" && <NotificationsScreen />}
          </section>
        ))}
      </main>
      <BottomTabs active={TAB_LIST.includes(activeScreen) ? activeScreen : ""} onChange={showTab} />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FramePicker
        open={framePickerOpen}
        imageURL={pendingImageURL}
        initialFrameURL={editingPost ? editingPost.frameURL || "" : ""}
        initialComposition={editingPost ? editingPost.composition || DEFAULT_COMPOSITION : DEFAULT_COMPOSITION}
        onConfirm={handleFrameConfirm}
        onClose={closeFramePicker}
      />
      <ChildPicker
        open={childPickerOpen}
        childrenList={childrenList}
        onSelect={(name) => { setChildPickerOpen(false); createPost(name, pendingImageURL, pendingFrameURL, pendingComposition); }}
        onClose={() => setChildPickerOpen(false)}
      />
      <AddChildSheet open={addChildOpen} onClose={() => setAddChildOpen(false)} onAdd={saveChild} />
      <CommentsSheet post={commentsPost} open={Boolean(commentsPost)} onClose={() => setCommentsPostId(null)} onAddComment={addPostComment} />
      <PostOptionsSheet post={optionsPost} open={Boolean(optionsPost)} onClose={() => setOptionsPostId(null)} onEditFrame={editPostFrame} onDelete={deletePost} />
      <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoSelected} />
    </div>
  );
}
