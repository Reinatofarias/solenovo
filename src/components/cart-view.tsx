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
      <div className="cart-header">
        <p className="eyebrow"><span className="status-dot" /> SUA SACOLA</p>
        <h1>Sacola de compras</h1>
        <p className="body-copy">
          {serverCart?.totalItems === 1
            ? "1 camisa selecionada"
            : `${serverCart?.totalItems ?? localItems.length} camisas selecionadas`}
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
                    sizes="100px"
                  />
                ) : (
                  <div className="admin-product-placeholder">S</div>
                )}
              </div>

              <div className="cart-item-info">
                <div className="cart-item-headline">
                  <Link href={`/produtos/${line.productSlug}`} className="cart-item-title">
                    <h2>{line.productName}</h2>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.variantId)}
                    className="cart-remove-button"
                    aria-label={`Remover ${line.productName} tamanho ${line.size} da sacola`}
                  >
                    Remover
                  </button>
                </div>

                <p className="cart-item-variant">
                  Tamanho: <strong>{line.size}</strong> · Cor: <strong>{line.color}</strong>
                </p>

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
                    <span>{line.quantity}</span>
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
                    <span>{formatPrice(line.totalPriceInCents)}</span>
                    {line.quantity > 1 && (
                      <span className="cart-unit-price">
                        ({formatPrice(line.unitPriceInCents)} cada)
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
          <h2>Resumo do pedido</h2>

          <div className="summary-row">
            <span>Subtotal ({serverCart?.totalItems} {serverCart?.totalItems === 1 ? "peça" : "peças"})</span>
            <strong>{formatPrice(serverCart?.subtotalInCents ?? 0)}</strong>
          </div>

          <div className="summary-row">
            <span>Frete estimado</span>
            <span className="summary-muted">Calculado no checkout</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatPrice(serverCart?.subtotalInCents ?? 0)}</strong>
          </div>

          <div className="cart-notice-box">
            <p>
              <strong>Pré-abertura:</strong> As vendas estão pausadas temporariamente. O checkout apresenta as informações de lançamento.
            </p>
          </div>

          <Link
            href="/checkout"
            className={`button cart-checkout-button ${serverCart?.hasUnavailableItems ? "disabled" : ""}`}
            aria-disabled={serverCart?.hasUnavailableItems}
          >
            Avançar para checkout
            <span aria-hidden="true">→</span>
          </Link>

          <Link href="/produtos" className="text-link cart-back-link">
            ← Continuar descobrindo a coleção
          </Link>
        </aside>
      </div>
    </section>
  );
}
