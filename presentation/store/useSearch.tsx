import { useState, useRef } from "react";
import type { ProductType } from "@/core/data/sales/DataSales";
import { productsData } from "@/core/data/sales/DataSales";
import { normalizeText } from "@/infraestructure/lib/utils";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<ProductType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const addProductByBarcode = (code: string) => {
    return productsData.find(
      (p) => normalizeText(p.code) === normalizeText(code)
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    searchSuggestions,
    setSearchSuggestions,
    showSuggestions,
    setShowSuggestions,
    barcodeMode,
    setBarcodeMode,
    searchInputRef,
    addProductByBarcode,
    selectedCategory,
    setSelectedCategory,
  };
};
