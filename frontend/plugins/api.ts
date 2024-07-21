import { pino, type Logger } from "pino";
import { Ok, Err, Result } from 'ts-results';

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[plugins][api] $config:', nuxtApp.$config)
  const backend = new ApiClient(nuxtApp.$config.public.apiBaseUrl);
  return {
    provide: {
      backend
    },
  };
});

const logger = pino({
  level: 'debug',
});
const SHOP_ID = 1 // hack because for the time being there will be just one shop

class ApiClient {
  baseUrl: string
  clients: ClientsClient
  orders: OrdersClient
  products: ProductsClient
  sales: SalesClient

  constructor(
    baseUrl: string,
  ) {
    this.baseUrl = `${baseUrl}/api`
    this.clients = new ClientsClient(this.baseUrl)
    this.orders = new OrdersClient(this.baseUrl)
    this.products = new ProductsClient(this.baseUrl)
    this.sales = new SalesClient(this.baseUrl)
  }

  getBaseUrl(): string {
    return this.baseUrl
  }
}

class ClientsClient {
  baseUrl: string

  constructor(
    baseUrl: string,
  ) {
    this.baseUrl = baseUrl
  }


  async get(shopSlug: string, clientUsername: string): Promise<Result<ClientDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Clients][get]",);
    const url = `${this.baseUrl}/shops/${shopSlug}/${clientUsername}`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Clients][get] not found")
        return Err(ApiErrorVariant.NotFound)
      } else if (response.status == 200) {
        let result: ClientDto = (await response.json()).data;
        logger.debug("[ApiClient][Clients][get] result", result);
        return Ok(result)
      } else {
        logger.error("[ApiClient][Clients][get] Error", await response.text())
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Clients][get] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async getAll(): Promise<Result<ClientDto[], ApiErrorVariant>> {
    logger.debug("[ApiClient][Clients][getAll]",);
    const url = `${this.baseUrl}/shops/${SHOP_ID}/clients`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Clients][getAll] not found")
        return Err(ApiErrorVariant.NotFound)
      }
      let result: ClientDto[] = await response.json();
      logger.debug("[ApiClient][Clients][getAll] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Clients][getAll] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async create(client: ClientDto): Promise<Result<number, ApiErrorVariant>> {
    logger.debug("[ApiClient][Clients][create] client", client)
    const url = `${this.baseUrl}/clients`;
    try {
      let body = JSON.stringify({
        data: {
          username: client.username,
          name: client.username,
          shop: SHOP_ID
        },
      });
      logger.debug("[ApiClient][Clients][create] body", body)
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Clients][create] response", response)
      let result = (await response.json());
      logger.debug("[ApiClient][Clients][create] result", result);
      if (result.data.id != null) {
        return Ok(result.data.id)
      } else {
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Clients][create] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }
}




class OrdersClient {
  baseUrl: string

  constructor(
    baseUrl: string,
  ) {
    this.baseUrl = baseUrl
  }

  async lastOrder(shopSlug: string, clientUsername: string): Promise<Result<OrderDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Orders][lastOrder]", { shopSlug, clientUsername })
    const url = `${this.baseUrl}/shops/${shopSlug}/${clientUsername}/last-order`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Orders][lastOrder] not found");
        return Err(ApiErrorVariant.NotFound)
      }
      let result: OrderDto = await response.json();
      logger.debug("[ApiClient][Orders][lastOrder] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Orders][lastOrder] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async updateNotes(orderId: number, notes: string): Promise<Result<null, ApiErrorVariant>> {
    logger.debug("[ApiClient][Orders][updateNotes]", { orderId, notes })
    const url = `${this.baseUrl}/orders/${orderId}/notes`;
    try {
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          notes: notes,
        }),
      });
      if (response.status != 200) {
        logger.warn("[ApiClient][Orders][updateNotes] error", response.text());
        return Err(ApiErrorVariant.NotFound)
      }
      await response.json();
      return Ok(null)
    } catch (error) {
      logger.error("[ApiClient][Orders][updateNotes] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async increment(orderItemId: number): Promise<Result<null, ApiErrorVariant>> {
    logger.debug("[ApiClient][Orders][increment]", { orderItemId })
    const url = `${this.baseUrl}/order-items/${orderItemId}/increment`;
    try {
      let response = await fetch(url, {
        method: "POST",
      });
      if (response.status != 200) {
        logger.warn("[ApiClient][Orders][increment] error", response.text());
        return Err(ApiErrorVariant.NotFound)
      }
      await response.json();
      return Ok(null)
    } catch (error) {
      logger.error("[ApiClient][Orders][increment] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async decrement(orderItemId: number): Promise<Result<null, ApiErrorVariant>> {
    logger.debug("[ApiClient][Orders][decrement]", { orderItemId })
    const url = `${this.baseUrl}/order-items/${orderItemId}/decrement`;
    try {
      let response = await fetch(url, {
        method: "POST",
      });
      if (response.status != 200) {
        logger.warn("[ApiClient][Orders][decrement] error", response.text());
        return Err(ApiErrorVariant.NotFound)
      }
      await response.json();
      return Ok(null)
    } catch (error) {
      logger.error("[ApiClient][Orders][decrement] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async get(orderId: number): Promise<Result<OrderDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Orders][get] orderId", orderId)
    const url = `${this.baseUrl}/orders/${orderId}`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Orders][get] not found");
        return Err(ApiErrorVariant.NotFound)
      }
      let result: OrderDto = (await response.json());
      logger.debug("[ApiClient][Orders][get] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Orders][get] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }
}
class ProductsClient {
  baseUrl: string

  constructor(
    baseUrl: string,
  ) {
    this.baseUrl = baseUrl
  }

  async get(productId: number): Promise<Result<ProductDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Products][get] productId", productId)
    const url = `${this.baseUrl}/products/${productId}`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Products][get] not found");
        return Err(ApiErrorVariant.NotFound)
      }
      let result: ProductDto = (await response.json()).data.attributes;
      result.id = productId
      logger.debug("[ApiClient][Products][get] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Products][get] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async getAll(): Promise<Result<ProductDto[], ApiErrorVariant>> {
    logger.debug("[ApiClient][Products][getAll]",);
    const url = `${this.baseUrl}/shops/${SHOP_ID}/products`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Products][getAll] not found")
        return Err(ApiErrorVariant.NotFound)
      }
      let result: ProductDto[] = await response.json();
      logger.debug("[ApiClient][Products][getAll] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Products][getAll] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async create(product: ProductDto): Promise<Result<number, ApiErrorVariant>> {
    logger.debug("[ApiClient][Products][create] product", product)
    const url = `${this.baseUrl}/products`;
    try {
      let body = JSON.stringify({
        data: {
          unit: product.unit,
          name: product.name,
          shop: SHOP_ID,
        },
      });
      logger.debug("[ApiClient][Products][create] body", body)
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Products][create] response", response)
      let result: ProductDto = (await response.json()).response;
      logger.debug("[ApiClient][Products][create] result", result);
      if (result.id != null) {
        return Ok(result.id)
      } else {
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Products][create] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async update(product: ProductDto): Promise<Result<ProductDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Products][update] product", product);
    let productId = product.id;
    const url = `${this.baseUrl}/products/${productId}`;
    try {
      let body = JSON.stringify({
        data: {
          unit: product.unit,
          name: product.name,
          shop: SHOP_ID,
        },
      });
      logger.debug("[ApiClient][Products][update] body", body)
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Products][update] response", response)
      let result: ProductDto = (await response.json()).data.attributes;
      result.id = productId;
      logger.debug("[ApiClient][Products][update] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Products][update] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }
}


class SalesClient {
  baseUrl: string

  constructor(
    baseUrl: string,
  ) {
    this.baseUrl = baseUrl
  }

  async get(saleId: number): Promise<Result<SaleDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Sales][get] saleId", saleId)
    const url = `${this.baseUrl}/sales/${saleId}`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Sales][get] not found");
        return Err(ApiErrorVariant.NotFound)
      }
      let result: SaleDto = (await response.json());
      logger.debug("[ApiClient][Sales][get] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Sales][get] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async getAll(): Promise<Result<SaleDto[], ApiErrorVariant>> {
    logger.debug("[ApiClient][Sales][getAll] SHOP_ID", SHOP_ID)
    const url = `${this.baseUrl}/shops/${SHOP_ID}/sales`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Sales][getAll] not found");
        return Err(ApiErrorVariant.NotFound)
      }
      let result: SaleDto[] = (await response.json());
      logger.debug("[ApiClient][Sales][getAll] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Sales][getAll] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async getOrders(saleId: number): Promise<Result<OrderDto[], ApiErrorVariant>> {
    logger.debug("[ApiClient][Sales][getOrders] saleId", saleId)
    const url = `${this.baseUrl}/sales/${saleId}/orders`;
    try {
      let response = await fetch(url);
      if (response.status == 404) {
        logger.warn("[ApiClient][Sales][getOrders] not found");
        return Err(ApiErrorVariant.NotFound)
      }
      let result: OrderDto[] = (await response.json());
      logger.debug("[ApiClient][Sales][getOrders] result", result);
      return Ok(result)
    } catch (error) {
      logger.error("[ApiClient][Sales][getOrders] error", error);
      return Err(ApiErrorVariant.Generic)
    }
  }

  async create(sale: SaleDto): Promise<Result<number, ApiErrorVariant>> {
    logger.debug("[ApiClient][Sales][create] sale", sale)
    const url = `${this.baseUrl}/sales`;
    try {
      let body = JSON.stringify({
        data: {
          startDate: sale.startDate,
          endDate: sale.endDate,
          shop: SHOP_ID,
        },
      });
      logger.debug("[ApiClient][Sales][create] body", body)
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Sales][create] response", response)
      let result: SaleDto = (await response.json()).data;
      logger.debug("[ApiClient][Sales][create] result", result);
      if (result.id != null) {
        return Ok(result.id)
      } else {
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Sales][create] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async update(sale: SaleDto): Promise<Result<SaleDto, ApiErrorVariant>> {
    logger.debug("[ApiClient][Sales][update] sale", sale)
    const saleId = sale.id;
    const url = `${this.baseUrl}/sales/${saleId}`;
    try {
      let body = JSON.stringify({
        data: {
          startDate: sale.startDate,
          endDate: sale.endDate,
          shop: SHOP_ID,
        },
      });
      logger.debug("[ApiClient][Sales][update] body", body)
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Sales][update] response", response)
      let result: SaleDto = (await response.json()).data.attributes;
      result.id = saleId;
      logger.debug("[ApiClient][Sales][update] result", result);
      if (result.id != null) {
        return Ok(result)
      } else {
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Sales][update] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async addProduct(saleId: number, productId: number): Promise<Result<number, ApiErrorVariant>> {
    logger.debug(`[ApiClient][Sales][addProduct] saleId ${saleId} productId ${productId}`)
    const url = `${this.baseUrl}/sales/${saleId}/products`;
    try {
      let body = JSON.stringify({
        data: {
          productId: productId
        },
      });
      logger.debug("[ApiClient][Sales][addProduct] body", body)
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Sales][addProduct] response", response)
      let result = (await response.json());
      logger.debug("[ApiClient][Sales][addProduct] result", result);
      if (result.id != null) {
        return Ok(result.id)
      } else {
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Sales][addProduct] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async updateProductAmount(productSaleId: number, amount_in_minor: number): Promise<Result<number, ApiErrorVariant>> {
    logger.debug(`[ApiClient][Sales][updateProductAmount] productSaleId ${productSaleId}`)
    const url = `${this.baseUrl}/product-sales/${productSaleId}/amount`;
    try {
      let body = JSON.stringify({
        data: {
          amount_in_minor: amount_in_minor
        },
      });
      logger.debug("[ApiClient][Sales][updateProductAmount] body", body)
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      if (response.status == 404) {
        return Err(ApiErrorVariant.NotFound)
      }
      logger.debug("[ApiClient][Sales][updateProductAmount] response", response)
      let result = (await response.json());
      logger.debug("[ApiClient][Sales][updateProductAmount] result", result);
      if (result.id != null) {
        return Ok(result.id)
      } else {
        return Err(ApiErrorVariant.Generic)
      }
    } catch (error) {
      logger.error("[ApiClient][Sales][updateProductAmount] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }

  async updateProductAvailability(productSaleId: number, total_available: number): Promise<Result<number, ApiErrorVariant>> {
    logger.debug(`[ApiClient][Sales][updateProductAvailability] total_available ${total_available}`)
    const url = `${this.baseUrl}/product-sales/${productSaleId}/totalAvailable`;
    try {
      let body = JSON.stringify({
        data: {
          total_available: total_available
        },
      });
      logger.debug("[ApiClient][Sales][updateProductAvailability] body", body)
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      logger.debug("[ApiClient][Sales][updateProductAvailability] response", response)
      if (response.status != 200) {
        return Err(ApiErrorVariant.Generic)
      } else {
        let result = (await response.json());
        logger.debug("[ApiClient][Sales][updateProductAvailability] result", result);
        if (result.id != null) {
          return Ok(result.id)
        } else {
          return Err(ApiErrorVariant.Generic)
        }
      }
    } catch (error) {
      logger.error("[ApiClient][Sales][updateProductAvailability] Error", error)
      return Err(ApiErrorVariant.Generic)
    }
  }
}

