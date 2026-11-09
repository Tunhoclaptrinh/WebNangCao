"use client";
import { useEffect, useState, useTransition } from "react";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { toggleFavorite } from "@/features/products/actions";
export function FavoriteButton({
  id,
  initialSaved,
}: {
  id: string;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [feedback, setFeedback] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (initialSaved !== undefined) {
      setSaved(initialSaved);
      return;
    }
    const controller = new AbortController();
    async function loadSavedState() {
      const session = await getSession();
      if (!session?.user.id || controller.signal.aborted) return;
      const response = await fetch("/api/me/favorites", {
        signal: controller.signal,
      });
      if (!response.ok) return;
      const result: { ids: string[] } = await response.json();
      if (!controller.signal.aborted) setSaved(result.ids.includes(id));
    }
    loadSavedState().catch(() => {});
    return () => controller.abort();
  }, [id, initialSaved]);
  return (
    <div className="favorite-action">
      <button
        className="button-primary favorite-button"
        type="button"
        disabled={pending}
        aria-busy={pending}
        aria-pressed={saved}
        onClick={() =>
          startTransition(async () => {
            const result = await toggleFavorite(id, !saved);
            setFeedback(result.message);
            if (!result.ok) {
              if (result.message.startsWith("Vui lòng đăng nhập"))
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(pathname)}`,
                );
              return;
            }
            setSaved(!saved);
            router.refresh();
          })
        }
      >
        <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
        {pending
          ? "Đang lưu…"
          : saved
            ? "Đã lưu sản phẩm"
            : "Lưu vào không gian của tôi"}
      </button>
      {feedback && (
        <p className="favorite-feedback" role="status">
          {feedback}
        </p>
      )}
    </div>
  );
}
