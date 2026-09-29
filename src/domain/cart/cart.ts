import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  variantId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(10),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});

export type Cart = z.infer<typeof cartSchema>;

export interface CalculatedCartLine {
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  size: string;
  color: string;
  unitPriceInCents: number;
  quantity: number;
  totalPriceInCents: number;
  image: { src: string; alt: string } | null;
  available: boolean;
}

export interface CalculatedCart {
  lines: CalculatedCartLine[];
  subtotalInCents: number;
  totalItems: number;
  hasUnavailableItems: boolean;
}
