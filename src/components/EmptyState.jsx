import Icon from "./Icon";

export default function EmptyState({ icon, title, text, actionLabel, onAction }) {
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
