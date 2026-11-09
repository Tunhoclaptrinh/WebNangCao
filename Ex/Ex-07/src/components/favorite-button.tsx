"use client";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, App } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toggleFavorite } from "@/features/products/actions";
export function FavoriteButton({
  id,
  initialSaved = false,
}: {
  id: string;
  initialSaved?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/me/favorites", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return;
        const result: { ids: string[] } = await response.json();
        setSaved(result.ids.includes(id));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [id]);
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
