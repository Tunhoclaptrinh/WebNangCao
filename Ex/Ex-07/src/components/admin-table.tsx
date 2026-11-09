/* eslint-disable @next/next/no-img-element -- baseline image delivery measured before optimization */
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  App,
  Button,
  Table,
  Tag,
  Modal,
  InputNumber,
  Popconfirm,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Product } from "@prisma/client";
import { updateProduct, deleteProduct } from "@/features/products/actions";
import { formatPrice } from "@/lib/site";
export type AdminProduct = Omit<Product, "updatedAt"> & { updatedAt: string };
export function AdminTable({ products }: { products: AdminProduct[] }) {
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const { message } = App.useApp();
  const router = useRouter();
  const runDelete = (id: string) =>
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.ok) {
        message.success(result.message);
        router.refresh();
      } else message.error(result.message);
    });
  const columns: ColumnsType<AdminProduct> = [
    {
      title: "Sản phẩm",
      key: "name",
      render: (_, item) => (
        <div className="admin-product-cell">
          <span className="admin-art" style={{ backgroundColor: item.color }}>
            <img
              src={`/images/${item.art}.svg`}
              width={62}
              height={50}
              alt=""
            />
          </span>
          <div>
            <strong>{item.name}</strong>
            <small>
              {item.id} · {item.brand}
            </small>
          </div>
        </div>
      ),
    },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (value: number) => formatPrice(value),
    },
    {
      title: "Tồn kho",
      key: "stock",
      render: (_, item) => (
        <Tag color={item.stock ? "green" : "default"}>
          {item.stock ? `${item.stock} sản phẩm` : "Hết hàng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, item) => (
        <div className="table-actions">
          <Button
            aria-label={`Sửa ${item.name}`}
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(item);
              setPrice(item.price);
              setStock(item.stock);
            }}
            disabled={pending}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm này?"
            description="Sản phẩm và lượt lưu liên quan sẽ được xóa."
            okText="Xóa sản phẩm"
            cancelText="Giữ lại"
            onConfirm={() => runDelete(item.id)}
          >
            <Button
              danger
              aria-label={`Xóa ${item.name}`}
              icon={<DeleteOutlined />}
              disabled={pending}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="admin-table">
        <Table
          rowKey="id"
          dataSource={products}
          columns={columns}
          pagination={false}
          scroll={{ x: 850 }}
          locale={{ emptyText: <Empty description="Chưa có sản phẩm" /> }}
        />
      </div>
      <Modal
        title="Cập nhật sản phẩm"
        open={Boolean(editing)}
        onCancel={() => setEditing(null)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={pending}
        okButtonProps={{ disabled: price === null || stock === null }}
        onOk={() => {
          if (!editing || price === null || stock === null) return;
          startTransition(async () => {
            const result = await updateProduct({
              id: editing.id,
              price,
              stock,
              updatedAt: editing.updatedAt,
            });
            if (result.ok) {
              message.success(result.message);
              setEditing(null);
              router.refresh();
            } else message.error(result.message);
          });
        }}
      >
        <p className="modal-product-name">{editing?.name}</p>
        <div className="edit-fields">
          <label htmlFor="product-price">Giá bán (VNĐ)</label>
          <InputNumber
            id="product-price"
            min={1000}
            max={1000000000}
            precision={0}
            value={price}
            onChange={setPrice}
            style={{ width: "100%" }}
          />
          <label htmlFor="product-stock">Số lượng tồn kho</label>
          <InputNumber
            id="product-stock"
            min={0}
            max={10000}
            precision={0}
            value={stock}
            onChange={setStock}
            style={{ width: "100%" }}
          />
        </div>
      </Modal>
    </>
  );
}
