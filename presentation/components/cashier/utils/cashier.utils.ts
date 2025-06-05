// Función para formatear moneda
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(amount);
};

// Función para formatear fecha y hora
export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

// Función helper para convertir montos a número
export const parseAmount = (amount: any): number => {
  if (typeof amount === "number") return amount;
  return parseFloat(amount || "0");
};
