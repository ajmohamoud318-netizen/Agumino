export const DEFAULT_COMPOSITION = { x: 0, y: 0, scale: 1 };

export const makePostId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const formatPostDate = (createdAt) => {
  if (!createdAt) return "Az önce";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
};

export const compositionStyle = (composition = DEFAULT_COMPOSITION) => ({
  transform: `translate(${composition.x}%, ${composition.y}%) scale(${composition.scale})`,
});
