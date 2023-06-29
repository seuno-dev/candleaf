import { rest } from "msw";
import baseUrl from "../url";
import { featuredProducts, products } from "../db/products";

export const PAGE_SIZE = 15.0;
export const productsHandler = [
  rest.get(baseUrl("/store/products/"), (req, res, context) => {
    const params = req.url.searchParams;

    const page = parseInt(params.get("page") || "1");

    const filteredProducts = products.filter((product) => {
      const unitPrice = product.unit_price;
      const burningTime = product.burning_time;

      console.log("params", params.get(""));

      if (
        params.get("price_min") &&
        unitPrice < parseFloat(<string>params.get("price_min"))
      )
        return false;

      if (
        params.get("price_max") &&
        unitPrice > parseFloat(<string>params.get("price_max"))
      )
        return false;

      if (
        params.get("burning_time_min") &&
        burningTime < parseFloat(<string>params.get("burning_time_min"))
      )
        return false;

      // noinspection RedundantIfStatementJS
      if (
        params.get("burning_time_max") &&
        burningTime > parseFloat(<string>params.get("burning_time_max"))
      )
        return false;

      return true;
    });

    const paginatedResult = filteredProducts.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

    return res(
      context.status(200),
      context.json({
        results: paginatedResult,
        total_pages: Math.ceil(filteredProducts.length / PAGE_SIZE),
      })
    );
  }),

  rest.get(baseUrl("/store/products/featured/"), (req, res, context) => {
    return res(context.status(200), context.json(featuredProducts));
  }),

  rest.get(baseUrl("/store/products/:slug/"), (req, res, context) => {
    const slug = req.params.slug as string;

    const product = products.find((product) => product.slug === slug);

    return res(context.status(200), context.json(product));
  }),
];
