export default function ChildPicker({ open, childrenList, onSelect, onClose }) {
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
