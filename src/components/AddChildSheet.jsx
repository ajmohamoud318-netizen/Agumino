import { useEffect, useState } from "react";

export default function AddChildSheet({ open, onClose, onAdd }) {
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
