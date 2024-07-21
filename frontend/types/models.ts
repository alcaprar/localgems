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
  unit: UnitType;
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
  unit: UnitType;
}

export interface Unit {
  id: number,
  name: string
}
export enum UnitType {
  Piece,
  Kilogram,
  Hectogram,
  Unknown,
}

export function UnitTypefromString(unit: string): UnitType {
  switch (unit) {
    case "Piece":
      return UnitType.Piece;
    case "Kg":
      return UnitType.Kilogram;
    case "Hg":
      return UnitType.Hectogram;
    default:
      return UnitType.Unknown;
  }
}

export function UnitTypetoString(unit: UnitType): string {
  switch (unit) {
    case UnitType.Piece:
      return "Piece";
    case UnitType.Kilogram:
      return "Kg";
    case UnitType.Hectogram:
      return "Hg";
    default:
      return "";
  }
}
