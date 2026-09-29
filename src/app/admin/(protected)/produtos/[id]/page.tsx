import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { parseCatalog } from "@/domain/catalog/product";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = parseCatalog(await catalogRepository.read()).find((item) => item.id === id);
  if (!product) notFound();
  return <ProductForm product={product} productId={product.id} />;
}
