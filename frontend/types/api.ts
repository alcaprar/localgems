export enum ApiErrorVariant {
  Generic,
  NotFound,
  Other
}

export interface Response<T> {
  data: ResponseItem<T>[];
  meta: ResponseMetadata;
}

export interface ResponseMetadata {
  pagination: ResponsePagination;
}

export interface ResponsePagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface ResponseItem<T> {
  attributes: T;
  id: number;
}

export interface OrderDto {
  id: number;
  notes: string;
  order_items: OrderItemDto[];
  sale: SaleDto;
  client: ClientDto,
  last_confirmed_at: Date
}

export interface OrderItemDto {
  id: number;
  quantity: number;
  product_sale: ProductSaleDto;
}

export interface ProductSaleDto {
  id: number;
  total_available: number;
  current_available: number;
  amount_in_minor: number;
  product: ProductDto;
}

export interface ClientDto {
  id?: number;
  username: string;
  name: string;
}

export interface SaleDto {
  id?: number;
  startDate: string;
  endDate: string;
  product_sales?: ProductSaleDto[]
}

export interface ProductDto {
  id?: number;
  name: string;
  unit: string;
}

export interface ShopDto {
  Name: string;
  Slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitDto {
  id?: number,
  name: string
}