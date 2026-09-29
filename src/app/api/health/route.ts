export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", service: "sole" }, {
    headers: { "Cache-Control": "no-store" },
  });
}
