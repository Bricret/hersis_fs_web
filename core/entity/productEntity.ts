export interface Products {
  id: string;
  name: string;
  state: ProductState;
  price: number;
  barCode: string;
  quantity: number;
  category: string;
  expirationDate: Date;
}

export enum ProductState {
  BAJO = "BAJO",
  MEDIO = "MEDIO",
  CRITICO = "CRITICO",
}
