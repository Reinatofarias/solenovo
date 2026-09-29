"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang="pt-BR"><body><main><h1>Não foi possível carregar a SOLE.</h1><p>Tente novamente em alguns instantes.</p><button onClick={reset}>Tentar novamente</button></main></body></html>;
}
