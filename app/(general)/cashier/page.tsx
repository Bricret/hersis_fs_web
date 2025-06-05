import MainCashierSection from "@/presentation/components/cashier/MainCashierSection";
import {
  getAllCash,
  getActiveCash,
  getCashSummary,
} from "@/presentation/services/server/cash.server";
import React from "react";

export default async function CashierPage() {
  const branchId = "dcdfcc7a-b5fa-444f-b6c1-bcff84365f64";

  // Cargar todos los datos en paralelo
  const [cashiers, activeCash] = await Promise.all([
    getAllCash(),
    getActiveCash(branchId).catch(() => null), // Si no hay caja activa, retornar null
  ]);

  // Si hay caja activa, cargar su resumen
  let activeCashSummary = null;
  if (activeCash?.id) {
    try {
      activeCashSummary = await getCashSummary(activeCash.id);
    } catch (error) {
      console.error("Error al cargar resumen de caja activa:", error);
    }
  }

  return (
    <MainCashierSection
      cash={cashiers}
      initialActiveCash={activeCash}
      initialSummary={activeCashSummary}
    />
  );
}
