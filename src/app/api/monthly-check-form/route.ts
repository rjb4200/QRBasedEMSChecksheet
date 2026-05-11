export const runtime = "nodejs";

const PDF_URL = "https://winchesterfireems.com/images/Monthly%20Ambulance%20Inventory.pdf";

export async function GET() {
  const res = await fetch(PDF_URL);
  if (!res.ok) return new Response("PDF not found", { status: 404 });
  return new Response(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
