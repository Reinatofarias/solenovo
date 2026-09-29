"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/domain/catalog/product";
import { addToCart } from "./cart-storage";

export function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductDetailView({ product }: { product: PublicProduct }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? ""
  );
  const [added, setAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const activeImage = product.images[selectedImageIndex] ?? product.images[0];

  function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.available) return;
    addToCart(product.id, selectedVariant.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 3500);
  }

  // Agrupamentos de tamanhos e cores
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));

  return (
    <article className="pdp-container">
      <nav aria-label="Navegação estrutural" className="pdp-breadcrumb">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <Link href="/produtos">A coleção</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pdp-layout">
        {/* Galeria de Fotos */}
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            {activeImage ? (
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            ) : (
              <div className="admin-product-placeholder">S</div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="pdp-thumbnails" role="group" aria-label="Fotos do produto">
              {product.images.map((img, idx) => (
                <button
                  key={img.src}
                  type="button"
                  className={`pdp-thumb-btn ${idx === selectedImageIndex ? "active" : ""}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`Ver foto ${idx + 1} de ${product.name}`}
                  aria-pressed={idx === selectedImageIndex}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações Comerciais e Seleção */}
        <div className="pdp-info">
          {product.collection && (
            <p className="eyebrow pdp-collection">{product.collection}</p>
          )}
          <h1 className="pdp-title">{product.name}</h1>

          {selectedVariant && (
            <p className="pdp-price" aria-label={`Preço: ${formatPrice(selectedVariant.priceInCents)}`}>
              {formatPrice(selectedVariant.priceInCents)}
            </p>
          )}

          {/* Seletores de Variantes */}
          <div className="pdp-options">
            {sizes.length > 1 && (
              <div className="pdp-option-group">
                <span className="pdp-option-label">Tamanho:</span>
                <div className="pdp-option-pills" role="radiogroup" aria-label="Selecione o tamanho">
                  {sizes.map((size) => {
                    const match = product.variants.find(
                      (v) => v.size === size && (colors.length <= 1 || v.color === selectedVariant?.color)
                    ) ?? product.variants.find((v) => v.size === size);
                    const isSelected = selectedVariant?.size === size;
                    const isAvail = match ? match.available : false;

                    return (
                      <button
                        key={size}
                        type="button"
                        className={`pdp-pill ${isSelected ? "selected" : ""} ${!isAvail ? "unavailable" : ""}`}
                        onClick={() => match && setSelectedVariantId(match.id)}
                        aria-checked={isSelected}
                        role="radio"
                      >
                        {size}
                        {!isAvail && <span className="pill-strike" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {colors.length > 1 && (
              <div className="pdp-option-group">
                <span className="pdp-option-label">Cor: {selectedVariant?.color}</span>
                <div className="pdp-option-pills" role="radiogroup" aria-label="Selecione a cor">
                  {colors.map((color) => {
                    const match = product.variants.find(
                      (v) => v.color === color && (sizes.length <= 1 || v.size === selectedVariant?.size)
                    ) ?? product.variants.find((v) => v.color === color);
                    const isSelected = selectedVariant?.color === color;

                    return (
                      <button
                        key={color}
                        type="button"
                        className={`pdp-pill ${isSelected ? "selected" : ""}`}
                        onClick={() => match && setSelectedVariantId(match.id)}
                        aria-checked={isSelected}
                        role="radio"
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Disponibilidade */}
          <div className="pdp-stock-status">
            {selectedVariant?.available ? (
              <span className="status-in-stock">
                <span className="status-dot" aria-hidden="true" /> Peça disponível para escolha
              </span>
            ) : (
              <span className="status-out-of-stock">Variação esgotada no momento</span>
            )}
          </div>

          {/* Ações */}
          <div className="pdp-actions">
            <button
              type="button"
              className="button pdp-add-button"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.available}
            >
              {added ? "Adicionado à sacola!" : "Adicionar à sacola"}
              <span aria-hidden="true">→</span>
            </button>

            {added && (
              <div className="pdp-added-notice" role="status">
                <span>Peça adicionada.</span>
                <Link href="/carrinho" className="text-link">
                  Ver sacola <span aria-hidden="true">↗</span>
                </Link>
              </div>
            )}
          </div>

          <div className="pdp-disclaimer">
            <p>
              <strong>Aviso de pré-abertura:</strong> As compras e transações financeiras
              estão temporariamente desabilitadas. Você pode compor sua sacola e explorar as peças.
            </p>
          </div>

          {/* Especificações Técnicas e Cuidados */}
          <div className="pdp-specs">
            {product.description && (
              <section className="pdp-spec-block">
                <h2>A peça</h2>
                <p>{product.description}</p>
              </section>
            )}

            {product.fabric && (
              <section className="pdp-spec-block">
                <h2>Tecido e composição</h2>
                <p>{product.fabric}</p>
              </section>
            )}

            {product.fit && (
              <section className="pdp-spec-block">
                <h2>Modelagem e caimento</h2>
                <p>{product.fit}</p>
              </section>
            )}

            {product.care && (
              <section className="pdp-spec-block">
                <h2>Cuidados de conservação</h2>
                <p>{product.care}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
