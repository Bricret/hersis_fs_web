import MainCashierSection from "@/presentation/components/cashier/MainCashierSection";
import { getAllCash } from "@/presentation/services/server/cash.server";
import React from "react";

export default async function CashierPage() {
  const cashiers = await getAllCash();
  return <MainCashierSection cash={cashiers} />;
}
