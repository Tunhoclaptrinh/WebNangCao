import { getMyFavorites } from "@/features/products/data";
import { AccessError } from "@/features/auth/guards";
export async function GET() {
  try {
    const favorites = await getMyFavorites();
    return Response.json(
      { ids: favorites.map((item) => item.productId) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof AccessError)
      return Response.json(
        { error: error.code },
        { status: error.code === "UNAUTHENTICATED" ? 401 : 403 },
      );
    throw error;
  }
}
