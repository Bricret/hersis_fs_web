export const formatTime = (date: Date | string) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diff = now.getTime() - targetDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return "ahora mismo";
  } else if (minutes < 60) {
    return `hace ${minutes} min`;
  } else if (hours < 24) {
    return `hace ${hours}h`;
  } else if (days < 7) {
    return `hace ${days}d`;
  } else {
    return targetDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
};
