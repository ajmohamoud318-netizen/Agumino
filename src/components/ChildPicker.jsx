export default function ChildPicker({ open, childrenList, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="child-picker open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="child-picker-sheet">
        <p className="child-picker-title">Hangi çocuk için?</p>
        <div className="child-picker-list">
          {childrenList.map((child) => (
            <button key={child.name} className="child-picker-row" onClick={() => onSelect(child.name)}>
              <div className="child-picker-row-avatar">{child.name[0].toUpperCase()}</div>
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
