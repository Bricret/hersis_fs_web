export interface ProductType {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  pricePerUnit: number;
  unit: string;
  unitsPerBox: number;
  stock: number;
  popular: boolean;
  image: string;
}

// Datos de productos ampliados con más información
export const productsData: ProductType[] = [
  {
    id: "PROD001",
    code: "P500",
    name: "Paracetamol 500mg",
    category: "Analgésicos",
    price: 5.99,
    pricePerUnit: 0.5,
    unit: "Blister",
    unitsPerBox: 12,
    stock: 150,
    popular: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD002",
    code: "I400",
    name: "Ibuprofeno 400mg",
    category: "Antiinflamatorios",
    price: 6.5,
    pricePerUnit: 0.55,
    unit: "Blister",
    unitsPerBox: 10,
    stock: 85,
    popular: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD003",
    code: "A500",
    name: "Amoxicilina 500mg",
    category: "Antibióticos",
    price: 15.75,
    pricePerUnit: 1.32,
    unit: "Caja",
    unitsPerBox: 12,
    stock: 45,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD004",
    code: "L10",
    name: "Loratadina 10mg",
    category: "Antialérgicos",
    price: 7.25,
    pricePerUnit: 0.73,
    unit: "Blister",
    unitsPerBox: 10,
    stock: 120,
    popular: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD005",
    code: "O20",
    name: "Omeprazol 20mg",
    category: "Antiácidos",
    price: 9.99,
    pricePerUnit: 1.0,
    unit: "Caja",
    unitsPerBox: 10,
    stock: 75,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD006",
    code: "D50",
    name: "Diclofenaco 50mg",
    category: "Antiinflamatorios",
    price: 8.5,
    pricePerUnit: 0.85,
    unit: "Blister",
    unitsPerBox: 10,
    stock: 95,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD007",
    code: "C10",
    name: "Cetirizina 10mg",
    category: "Antialérgicos",
    price: 6.75,
    pricePerUnit: 0.68,
    unit: "Blister",
    unitsPerBox: 10,
    stock: 110,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD008",
    code: "A100",
    name: "Aspirina 100mg",
    category: "Analgésicos",
    price: 4.99,
    pricePerUnit: 0.42,
    unit: "Blister",
    unitsPerBox: 12,
    stock: 200,
    popular: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD009",
    code: "R150",
    name: "Ranitidina 150mg",
    category: "Antiácidos",
    price: 8.25,
    pricePerUnit: 0.83,
    unit: "Caja",
    unitsPerBox: 10,
    stock: 65,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD010",
    code: "AZ500",
    name: "Azitromicina 500mg",
    category: "Antibióticos",
    price: 18.99,
    pricePerUnit: 6.33,
    unit: "Caja",
    unitsPerBox: 3,
    stock: 35,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD011",
    code: "V5",
    name: "Vitamina C 500mg",
    category: "Suplementos",
    price: 12.5,
    pricePerUnit: 0.63,
    unit: "Frasco",
    unitsPerBox: 20,
    stock: 80,
    popular: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "PROD012",
    code: "J100",
    name: "Jabón Antibacterial",
    category: "Higiene",
    price: 3.99,
    pricePerUnit: 3.99,
    unit: "Unidad",
    unitsPerBox: 1,
    stock: 50,
    popular: true,
    image: "/placeholder.svg?height=80&width=80",
  },
];

// Categorías disponibles
export const categories = [
  { id: "all", name: "Todos" },
  { id: "analgesicos", name: "Analgésicos" },
  { id: "antiinflamatorios", name: "Antiinflamatorios" },
  { id: "antibioticos", name: "Antibióticos" },
  { id: "antialergicos", name: "Antialérgicos" },
  { id: "antiacidos", name: "Antiácidos" },
  { id: "suplementos", name: "Suplementos" },
  { id: "higiene", name: "Higiene" },
];

export interface RecentSalesProps {
  id: string;
  date: Date;
  items: any[];
  total: number;
  paymentMethod: string;
}
// Historial de ventas recientes
export const recentSales: RecentSalesProps[] = [
  {
    id: "S001",
    date: new Date(2025, 2, 12, 10, 15),
    items: [
      { id: "PROD001", name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
      { id: "PROD004", name: "Loratadina 10mg", quantity: 1, price: 7.25 },
    ],
    total: 19.23,
    paymentMethod: "Efectivo",
  },
  {
    id: "S002",
    date: new Date(2025, 2, 12, 9, 45),
    items: [
      { id: "PROD008", name: "Aspirina 100mg", quantity: 1, price: 4.99 },
      { id: "PROD011", name: "Vitamina C 500mg", quantity: 1, price: 12.5 },
    ],
    total: 17.49,
    paymentMethod: "Tarjeta",
  },
  {
    id: "S003",
    date: new Date(2025, 2, 12, 9, 30),
    items: [
      { id: "PROD012", name: "Jabón Antibacterial", quantity: 2, price: 3.99 },
    ],
    total: 7.98,
    paymentMethod: "Efectivo",
  },
];

export interface CartItem {
  id: string;
  name: string;
  price: number;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  unitsPerBox: number;
  sellByUnit: boolean;
}
