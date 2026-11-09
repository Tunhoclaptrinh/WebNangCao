import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/components/providers";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <Providers>{children}</Providers>
    </AntdRegistry>
  );
}
