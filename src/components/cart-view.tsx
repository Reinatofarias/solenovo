"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "./empty-state";
import {
  subscribeCart,
  getCartSnapshot,
  getServerSnapshot,
  updateCartQuantity,
  removeFromCart,
  type LocalCartItem,
} from "./cart-storage";
import { formatPrice } from "./product-detail-view";
import type { CalculatedCart } from "@/domain/cart/cart";

export function CartView() {
  const rawCart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerSnapshot);
  const [serverCart, setServerCart] = useState<CalculatedCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const localItems = useMemo<LocalCartItem[]>(() => {
    try {
      const parsed = JSON.parse(rawCart) as unknown;
      if (Array.isArray(parsed)) {
        return parsed as LocalCartItem[];
      }
    } catch {
      // Ignora erro de parse
    }
    return [];
  }, [rawCart]);

  useEffect(() => {
    if (localItems.length === 0) return;

    let active = true;

    async function fetchServerValidation() {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: localItems }),
        });
        if (response.ok && active) {
          const json = await response.json() as { data: CalculatedCart };
          setServerCart(json.data);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchServerValidation();

    return () => {
      active = false;
    };
  }, [localItems]);

  const isEmpty = localItems.length === 0 || (!isLoading && (!serverCart || serverCart.lines.length === 0));

  if (isEmpty) {
    return (
      <EmptyState
        eyebrow="SUA SACOLA"
        title="Ainda não há peças por aqui."
        description="Nossa coleção de camisas está em preparação. Explore as peças e adicione suas escolhas à sacola."
        href="/produtos"
        action="Ver a coleção"
      />
    );
  }

  return (
    <section className="cart-page-section">
      <nav className="cart-breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/produtos">A Coleção</Link>
        <span className="breadcrumb-separator">/</span>
        <span aria-current="page">Sacola de Compras</span>
      </nav>

      <div className="cart-header">
        <p className="eyebrow"><span className="status-dot-pulse" aria-hidden="true" /> ATELIER SOLE · SUAS ESCOLHAS</p>
        <h1>Sacola de compras</h1>
        <p className="body-copy">
          {serverCart?.totalItems === 1
            ? "1 camisa autoral selecionada para o seu closet"
            : `${serverCart?.totalItems ?? localItems.length} camisas autorais selecionadas`}
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-lines-container">
          {serverCart?.lines.map((line) => (
            <article key={line.variantId} className="cart-item-row">
              <div className="cart-item-image">
                {line.image ? (
                  <Image
                    src={line.image.src}
                    alt={line.image.alt}
                    fill
                    sizes="120px"
                  />
                ) : (
                  <div className="admin-product-placeholder">S</div>
                )}
              </div>

              <div className="cart-item-info">
                <div className="cart-item-headline">
                  <div className="cart-item-headings">
                    <span className="cart-item-kicker">ALTA CAMISARIA</span>
                    <Link href={`/produtos/${line.productSlug}`} className="cart-item-title">
                      <h2>{line.productName}</h2>
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.variantId)}
                    className="cart-remove-button"
                    aria-label={`Remover ${line.productName} tamanho ${line.size} da sacola`}
                  >
                    <span className="remove-icon" aria-hidden="true">✕</span>
                    <span>Remover</span>
                  </button>
                </div>

                <div className="cart-item-tags">
                  <span className="cart-tag">Tamanho: <strong>{line.size}</strong></span>
                  <span className="cart-tag">Cor: <strong>{line.color}</strong></span>
                </div>

                {!line.available && (
                  <p className="cart-item-warning">
                    Variação esgotada no estoque. Remova ou altere para prosseguir.
                  </p>
                )}

                <div className="cart-item-bottom">
                  <div className="cart-quantity-selector" role="group" aria-label="Controle de quantidade">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(line.variantId, line.quantity - 1)}
                      aria-label="Diminuir quantidade"
                      disabled={line.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(line.variantId, line.quantity + 1)}
                      aria-label="Aumentar quantidade"
                      disabled={line.quantity >= 10}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price">
                    <span className="price-total">{formatPrice(line.totalPriceInCents)}</span>
                    {line.quantity > 1 && (
                      <span className="cart-unit-price">
                        {formatPrice(line.unitPriceInCents)} cada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Resumo da Sacola */}
        <aside className="cart-summary-card">
          <div className="cart-summary-badge">
            <span>RESUMO DA SELEÇÃO</span>
          </div>

          <h2>Resumo do pedido</h2>

          <div className="summary-row">
            <span>Subtotal ({serverCart?.totalItems} {serverCart?.totalItems === 1 ? "peça" : "peças"})</span>
            <strong>{formatPrice(serverCart?.subtotalInCents ?? 0)}</strong>
          </div>

          <div className="summary-row">
            <span>Embalagem de Alfaiataria</span>
            <span className="summary-highlight">Cortesia</span>
          </div>

          <div className="summary-row">
            <span>Frete estimado</span>
            <span className="summary-muted">Calculado no checkout</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row summary-total">
            <span>Total estimado</span>
            <strong>{formatPrice(serverCart?.subtotalInCents ?? 0)}</strong>
          </div>

          <div className="cart-notice-box">
            <div className="notice-icon" aria-hidden="true">✦</div>
            <p>
              <strong>Fase de Pré-lançamento:</strong> As vendas oficiais serão iniciadas em breve. Conclua a prévia para conhecer a experiência.
            </p>
          </div>

          <Link
            href="/checkout"
            className={`button cart-checkout-button ${serverCart?.hasUnavailableItems ? "disabled" : ""}`}
            aria-disabled={serverCart?.hasUnavailableItems}
          >
            <span>Avançar para checkout</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </Link>

          <Link href="/produtos" className="text-link cart-back-link">
            <span>← Continuar explorando a coleção</span>
          </Link>

          <div className="cart-atelier-perks">
            <div className="perk-item">
              <span className="perk-dot">✓</span>
              <span>Embalagem protetora rígida inclusa</span>
            </div>
            <div className="perk-item">
              <span className="perk-dot">✓</span>
              <span>Ajuste fino de alfaiataria sob consulta</span>
            </div>
            <div className="perk-item">
              <span className="perk-dot">✓</span>
              <span>Transação protegida e atendimento consultivo</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
