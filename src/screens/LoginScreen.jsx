import { useRef, useState } from "react";
import Icon from "../components/Icon";

const passwordRules = [
  { key: "length", label: "En az 8 karakter", test: (v) => v.length >= 8 },
  { key: "upper", label: "En az 1 büyük harf", test: (v) => /[A-ZÇĞİÖŞÜ]/.test(v) },
  { key: "lower", label: "En az 1 küçük harf", test: (v) => /[a-zçğıöşü]/.test(v) },
  { key: "number", label: "En az 1 rakam", test: (v) => /\d/.test(v) },
];

export default function LoginScreen({ onLogin }) {
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

  const focusSignup = (index) => signupInputRefs.current[index]?.focus();

  const handleSignupKeyDown = (e, next) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    next === "submit" ? e.currentTarget.form?.requestSubmit() : focusSignup(next);
  };

  const handleLoginKeyDown = (e, next) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    next === "submit" ? e.currentTarget.form?.requestSubmit() : loginInputRefs.current[next]?.focus();
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
                <button className="signup-icon-button" type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Şifreyi göster"><Icon name="eye" /></button>
              </div>
              <div className="signup-field with-icon with-trailing-icon">
                <Icon name="lock" />
                <input ref={(el) => { signupInputRefs.current[5] = el; }} type={showRepeatPassword ? "text" : "password"} placeholder="Şifre Tekrar" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} onKeyDown={(e) => handleSignupKeyDown(e, 6)} autoComplete="new-password" enterKeyHint="next" />
                <button className="signup-icon-button" type="button" onClick={() => setShowRepeatPassword((v) => !v)} aria-label="Şifre tekrarını göster"><Icon name="eye" /></button>
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
