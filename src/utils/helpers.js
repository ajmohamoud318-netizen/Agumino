export const DEFAULT_COMPOSITION = { x: 0, y: 0, scale: 1 };

export const makePostId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const formatPostDate = (createdAt) => {
  if (!createdAt) return "şimdi";
  const diff = (Date.now() - new Date(createdAt)) / 1000;
  if (diff < 60) return "şimdi";
  if (diff < 3600) return `${Math.floor(diff / 60)}d`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}s`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}g`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}h`;
  return `${Math.floor(diff / 2592000)}ay`;
};

export const compositionStyle = (composition = DEFAULT_COMPOSITION) => ({
  transform: `translate(${composition.x}%, ${composition.y}%) scale(${composition.scale})`,
});
