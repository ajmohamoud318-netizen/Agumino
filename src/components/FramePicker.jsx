import { useEffect, useRef, useState } from "react";
import { DEFAULT_COMPOSITION, compositionStyle } from "../utils/helpers";

const FRAMES = [
  { label: "Yok", value: "" },
  { label: "Agumino 1", value: "/agumino1.png" },
  { label: "Agumino 2", value: "/agumino2.png" },
  { label: "Bebeğim", value: "/bebegim3.png" },
];

export default function FramePicker({ open, imageURL, initialFrameURL = "", initialComposition = DEFAULT_COMPOSITION, onConfirm, onClose }) {
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
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, startComposition: composition };
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

  const selectedFrame = FRAMES.find((f) => f.value === selected);

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
