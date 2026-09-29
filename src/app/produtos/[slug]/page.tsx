import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/application/catalog/get-product";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";
import { ProductDetailView } from "@/components/product-detail-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(catalogRepository, slug);
  if (!product) return { title: "Produto não encontrado" };

  return {
    title: product.name,
    description: product.description || `Camisa ${product.name} — SOLE Camisaria`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(catalogRepository, slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
