"use client";
import { useEffect, useState, useTransition } from "react";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button, App } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toggleFavorite } from "@/features/products/actions";
export function FavoriteButton({
  id,
  initialSaved,
}: {
  id: string;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  useEffect(() => {
    if (initialSaved !== undefined) {
      setSaved(initialSaved);
      return;
    }
    const controller = new AbortController();
    async function loadSavedState() {
      // Query public session first: guests do not issue a forbidden data request.
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
    <Button
      type="primary"
      size="large"
      icon={saved ? <HeartFilled /> : <HeartOutlined />}
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleFavorite(id, !saved);
          if (!result.ok) {
            message.warning(result.message);
            if (result.message.startsWith("Vui lòng đăng nhập"))
              router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
          }
          setSaved(!saved);
          message.success(result.message);
          router.refresh();
        })
      }
    >
      {saved ? "Đã lưu sản phẩm" : "Lưu vào không gian của tôi"}
    </Button>
  );
}
