import { useEffect, useRef, useState } from "react";
import { DEFAULT_COMPOSITION, compositionStyle } from "../utils/helpers";

const CATEGORIES = [
  {
    id: "square",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
      </svg>
    ),
  },
  {
    id: "heart",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-9-5.6-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.4-9 11-9 11z" />
      </svg>
    ),
  },
  {
    id: "arch",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21V12a7 7 0 1 1 14 0v9H5z" />
      </svg>
    ),
  },
];

const FRAMES = [
  { label: "Bebeğim", value: "/bebegim3.png", category: "square" },
  { label: "Agumino 2", value: "/agumino2.png", category: "heart" },
  { label: "Agumino 1", value: "/agumino1.png", category: "arch" },
];

export default function FramePicker({ open, imageURL, initialFrameURL = FRAMES[0].value, initialComposition = DEFAULT_COMPOSITION, onConfirm, onClose }) {
  const initialCategory = FRAMES.find((f) => f.value === initialFrameURL)?.category ?? CATEGORIES[0].id;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selected, setSelected] = useState(initialFrameURL);
  const [composition, setComposition] = useState(initialComposition);
  const previewRef = useRef(null);
  const dragRef = useRef(null);
  const pointersRef = useRef({});
  const gestureRef = useRef(null);

  useEffect(() => {
    if (open) {
      const cat = FRAMES.find((f) => f.value === initialFrameURL)?.category ?? CATEGORIES[0].id;
      setSelectedCategory(cat);
      setSelected(initialFrameURL);
      setComposition(initialComposition);
      dragRef.current = null;
      pointersRef.current = {};
      gestureRef.current = null;
    }
  }, [open, imageURL, initialFrameURL, initialComposition]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const first = FRAMES.find((f) => f.category === catId);
    if (first) setSelected(first.value);
  };

  const handlePointerDown = (e) => {
    if (!previewRef.current) return;
    previewRef.current.setPointerCapture(e.pointerId);
    pointersRef.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    const pts = Object.values(pointersRef.current);
    if (pts.length === 1) {
      dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, startComposition: composition };
      gestureRef.current = null;
    } else if (pts.length === 2) {
      dragRef.current = null;
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      gestureRef.current = { startDist: dist, startScale: composition.scale };
    }
  };

  const handlePointerMove = (e) => {
    if (!(e.pointerId in pointersRef.current) || !previewRef.current) return;
    pointersRef.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    const pts = Object.values(pointersRef.current);
    if (pts.length >= 2 && gestureRef.current) {
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const newScale = Math.max(1, Math.min(2.4, gestureRef.current.startScale * (dist / gestureRef.current.startDist)));
      setComposition((prev) => ({ ...prev, scale: newScale }));
    } else if (pts.length === 1 && dragRef.current && dragRef.current.pointerId === e.pointerId) {
      const rect = previewRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
      setComposition({
        ...dragRef.current.startComposition,
        x: Math.max(-35, Math.min(35, dragRef.current.startComposition.x + dx)),
        y: Math.max(-35, Math.min(35, dragRef.current.startComposition.y + dy)),
      });
    }
  };

  const handlePointerUp = (e) => {
    if (previewRef.current?.hasPointerCapture(e.pointerId)) {
      previewRef.current.releasePointerCapture(e.pointerId);
    }
    delete pointersRef.current[e.pointerId];
    dragRef.current = null;
    gestureRef.current = null;
  };

  const filteredFrames = FRAMES.filter((f) => f.category === selectedCategory);
  const selectedFrame = FRAMES.find((f) => f.value === selected);

  if (!open) return null;
  return (
    <div className="frame-picker open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="frame-picker-sheet">
        <p className="frame-picker-title">Çerçeve seç</p>
        <p className="frame-picker-subtitle">{selectedFrame?.label ?? ""}</p>
        <div className="frame-preview-area">
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
          <div className="frame-category-btns">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`frame-category-btn${selectedCategory === cat.id ? " active" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="frame-thumbs" aria-label="Çerçeveler">
          {filteredFrames.map((f) => (
            <button key={f.value} className={`frame-thumb${selected === f.value ? " selected" : ""}`} onClick={() => setSelected(f.value)}>
              <img src={f.value} alt={f.label} />
            </button>
          ))}
        </div>
        <button className="frame-confirm" onClick={() => { onConfirm(selected, composition); setSelected(""); }}>Devam Et →</button>
      </div>
    </div>
  );
}
