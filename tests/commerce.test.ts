import { expect, it } from "vitest";
import { salesUnavailableResponse } from "../src/application/commerce/sales-unavailable";

it("keeps financial operations unavailable without exposing a fake order or transaction", async () => {
  const response = salesUnavailableResponse();
  expect(response.status).toBe(503);
  expect(response.headers.get("Cache-Control")).toBe("no-store");
  expect(await response.json()).toEqual({ error: {
    code: "SALES_UNAVAILABLE", message: "As compras ainda não estão disponíveis.",
  } });
});
