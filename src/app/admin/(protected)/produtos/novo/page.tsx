import { ProductForm } from "@/components/admin/product-form";
import { randomUUID } from "node:crypto";

export default function NewProductPage() { return <ProductForm productId={randomUUID()} />; }
