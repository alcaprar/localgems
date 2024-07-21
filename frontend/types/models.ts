export interface Order {
  id: number;
  items: OrderItem[];
  notes: string;
  sale: Sale;
  client: Client
}

export interface Client {
  id: number;
  username: string;
  name: string;
}

export interface OrderItem {
  id: number;
  name: string;
  available_quantity: number;
  unit: string;
  price_per_unit_in_minor: number;
  quantity: number;
}

export interface Sale {
  id: string;
  startDate: Date;
  endDate: Date;
  products?: ProductSale
}

export interface ProductSale {
  id: number;
  amount_in_minor: number;
  total_available: number;
  current_available: number;
  product: Product
}

export interface Product {
  id: number;
  name: string;
  unit: string;
}

export interface Unit {
  id: number,
  name: string
}
