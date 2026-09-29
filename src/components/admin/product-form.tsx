"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProductAction } from "@/app/admin/actions";
import type { Product } from "@/domain/catalog/product";

type EditableVariant = { id: string; sku: string; size: string; color: string; price: string; stock: number };
type EditableImage = { src: string; alt: string };

function SubmitButton() { const { pending } = useFormStatus(); return <button className="admin-primary" disabled={pending}>{pending ? "Salvando…" : "Salvar peça"}</button>; }
const newId = () => crypto.randomUUID();

export function ProductForm({ product, productId }: { product?: Product; productId: string }) {
  const [state, action] = useActionState(saveProductAction, {});
  const [variants, setVariants] = useState<EditableVariant[]>(() => product?.variants.map((variant) => ({ ...variant, price: (variant.priceInCents / 100).toFixed(2) })) ?? []);
  const [images, setImages] = useState<EditableImage[]>(product?.images ?? []);
  const [fileCount, setFileCount] = useState(0);
  const serializedVariants = useMemo(() => JSON.stringify(variants), [variants]);
  const serializedImages = useMemo(() => JSON.stringify(images), [images]);
  const updateVariant = (id: string, field: keyof EditableVariant, value: string | number) => setVariants((current) => current.map((variant) => variant.id === id ? { ...variant, [field]: value } : variant));

  return (
    <form action={action} className="product-form">
      <input type="hidden" name="id" value={productId} /><input type="hidden" name="variants" value={serializedVariants} /><input type="hidden" name="existingImages" value={serializedImages} />
      <div className="form-toolbar"><div><p className="admin-kicker">CATÁLOGO</p><h1>{product ? "Editar peça" : "Nova peça"}</h1></div><div className="form-actions"><Link href="/admin/produtos">Cancelar</Link><SubmitButton /></div></div>
      {state.error ? <p className="form-error form-error-wide" role="alert">{state.error}</p> : null}
      <div className="admin-form-grid">
        <section className="admin-card form-section"><h2>Informações principais</h2><div className="fields-grid">
          <label className="field-span">Nome da peça<input name="name" defaultValue={product?.name} required maxLength={200} /></label>
          <label>Slug<input name="slug" defaultValue={product?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="camisa-oxford-azul" /></label>
          <label>Coleção<input name="collection" defaultValue={product?.collection} maxLength={120} /></label>
          <label className="field-span">Descrição<textarea name="description" defaultValue={product?.description} rows={6} maxLength={5000} /></label>
          <label>Tecido<input name="fabric" defaultValue={product?.fabric} maxLength={500} /></label>
          <label>Modelagem<input name="fit" defaultValue={product?.fit} maxLength={500} /></label>
          <label className="field-span">Cuidados<textarea name="care" defaultValue={product?.care} rows={3} maxLength={1000} /></label>
        </div></section>
        <aside className="admin-card form-section"><h2>Publicação</h2><label>Status<select name="status" defaultValue={product?.status ?? "draft"}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label><label className="check-field"><input name="featured" type="checkbox" defaultChecked={product?.featured} /> Destacar na coleção</label><p className="field-help">Publicar exige descrição, foto e ao menos uma variante válida.</p></aside>
      </div>
      <section className="admin-card form-section"><div className="section-heading"><div><h2>Fotos</h2><p>Selecione várias imagens de uma vez. A primeira será a capa.</p></div></div>
        {images.length ? <div className="image-admin-grid">{images.map((image, index) => <div className="image-admin-item" key={image.src}><div className="image-preview"><Image src={image.src} alt={image.alt} fill sizes="180px" /></div><label>Texto alternativo<input value={image.alt} onChange={(event) => setImages((current) => current.map((item) => item.src === image.src ? { ...item, alt: event.target.value } : item))} /></label><button type="button" onClick={() => setImages((current) => current.filter((item) => item.src !== image.src))}>Remover{index === 0 ? " capa" : ""}</button></div>)}</div> : <p className="admin-empty-inline">Nenhuma foto salva.</p>}
        <label className="upload-zone">Adicionar fotos<input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => setFileCount(event.target.files?.length ?? 0)} /><span>{fileCount ? `${fileCount} arquivo(s) selecionado(s)` : "JPEG, PNG, WebP ou AVIF · até 8 MB por foto"}</span></label>
      </section>
      <section className="admin-card form-section"><div className="section-heading"><div><h2>Variações e estoque</h2><p>Uma linha para cada combinação de tamanho e cor.</p></div><button type="button" className="admin-secondary" onClick={() => setVariants((current) => [...current, { id: newId(), sku: "", size: "", color: "", price: "", stock: 0 }])}>Adicionar variação</button></div>
        {variants.length ? <div className="variant-list">{variants.map((variant, index) => <fieldset key={variant.id}><legend>Variação {index + 1}</legend><label>SKU<input value={variant.sku} onChange={(event) => updateVariant(variant.id, "sku", event.target.value)} required /></label><label>Tamanho<input value={variant.size} onChange={(event) => updateVariant(variant.id, "size", event.target.value)} required /></label><label>Cor<input value={variant.color} onChange={(event) => updateVariant(variant.id, "color", event.target.value)} required /></label><label>Preço (R$)<input inputMode="decimal" value={variant.price} onChange={(event) => updateVariant(variant.id, "price", event.target.value)} placeholder="199,90" required /></label><label>Estoque<input type="number" min="0" step="1" value={variant.stock} onChange={(event) => updateVariant(variant.id, "stock", Number(event.target.value))} required /></label><button type="button" onClick={() => setVariants((current) => current.filter((item) => item.id !== variant.id))}>Remover</button></fieldset>)}</div> : <p className="admin-empty-inline">Adicione tamanhos, cores, preços e estoque antes de publicar.</p>}
      </section>
      <section className="admin-card form-section"><h2>SEO</h2><div className="fields-grid"><label>Título SEO<input name="seoTitle" defaultValue={product?.seoTitle} maxLength={70} /></label><label className="field-span">Descrição SEO<textarea name="seoDescription" defaultValue={product?.seoDescription} rows={3} maxLength={170} /></label></div></section>
      <div className="form-actions form-actions-bottom"><Link href="/admin/produtos">Cancelar</Link><SubmitButton /></div>
    </form>
  );
}
