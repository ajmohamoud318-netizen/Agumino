import EmptyState from "../components/EmptyState";

export default function NotificationsScreen() {
  return (
    <div className="stack">
      <EmptyState icon="bell" title="Henüz bildirim yok" text="Beğeniler, yorumlar ve aile davetleri burada görünecek." />
    </div>
  );
}
