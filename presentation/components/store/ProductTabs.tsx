import { Star, BoxIcon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import TabFavoriteProducts from "@/presentation/components/store/TabFavoriteProducts";
import { TabAllProducts } from "@/presentation/components/store/TabAllProducts";
import type { ProductType } from "@/core/data/sales/DataSales";

interface ProductTabsProps {
  searchTerm: string;
  selectedCategory: string;
  onProductSelect: (product: ProductType) => void;
  showProductDialog: (product: ProductType) => void;
  setSearchSuggestions: (suggestions: ProductType[]) => void;
  setShowSuggestions: (show: boolean) => void;
}

export const ProductTabs = ({
  searchTerm,
  selectedCategory,
  onProductSelect,
  showProductDialog,
  setSearchSuggestions,
  setShowSuggestions,
}: ProductTabsProps) => {
  return (
    <Tabs defaultValue="tabSection-1">
      <TabsList className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
        <TabsTrigger
          value="tabSection-1"
          className="bg-white border data-[state=active]:bg-quaternary-background-color border-main-background-color overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none flex items-center"
        >
          <Star className="ml-2 h-4 w-4 text-yellow-500 mr-1" />
          Productos populares
        </TabsTrigger>
        <TabsTrigger
          value="tabSection-2"
          className="bg-white border border-main-background-color data-[state=active]:bg-quaternary-background-color overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
        >
          <BoxIcon className="-ms-0.5 me-1.5" size={16} aria-hidden="true" />
          Todos los productos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tabSection-1">
        <TabFavoriteProducts
          searchTerm={searchTerm}
          showProductDialog={showProductDialog}
          setSearchSuggestions={setSearchSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
      </TabsContent>
      <TabsContent value="tabSection-2">
        <TabAllProducts
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          showProductDialog={showProductDialog}
        />
      </TabsContent>
    </Tabs>
  );
};
