import { useEffect, useMemo, useState } from 'react';
import {
  ExclamationCircleOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Result,
  Row,
  Skeleton,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { ProductCard } from './ProductCard.tsx';
import { ProductFilter } from './ProductFilter.tsx';
import { useGetProductsQuery } from './productsApi.ts';
import { fetchProductsAsync } from './productsSlice.ts';
import type { Product } from './productTypes.ts';

const { Title, Text } = Typography;

interface ProductListProps {
  dataSource: 'thunk' | 'rtk-query';
  setDataSource: (source: 'thunk' | 'rtk-query') => void;
}

export function ProductList({ dataSource }: ProductListProps) {
  const dispatch = useAppDispatch();

  // State từ Redux Thunk
  const thunkProducts = useAppSelector((state) => state.products.items);
  const thunkStatus = useAppSelector((state) => state.products.status);
  const thunkError = useAppSelector((state) => state.products.error);

  // State bộ lọc và tìm kiếm từ Redux
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);
  const searchQuery = useAppSelector((state) => state.products.searchQuery);
  const sortBy = useAppSelector((state) => state.products.sortBy);

  // Điều khiển giả lập lỗi để test trạng thái rejected / error
  const [simulateError, setSimulateError] = useState(false);

  // 1. Dữ liệu từ RTK Query (Bonus điểm cộng)
  const {
    data: rtkProducts,
    isLoading: isRtkLoading,
    isError: isRtkError,
    error: rtkErrorObj,
    refetch: refetchRtk,
  } = useGetProductsQuery(
    simulateError ? { shouldFail: true } : undefined,
    { skip: dataSource !== 'rtk-query' }
  );

  // 2. Fetch dữ liệu qua Redux Thunk khi khởi chạy hoặc chuyển chế độ
  useEffect(() => {
    if (dataSource === 'thunk') {
      dispatch(fetchProductsAsync({ shouldFail: simulateError }));
    }
  }, [dataSource, simulateError, dispatch]);

  const handleRetry = () => {
    if (dataSource === 'thunk') {
      dispatch(fetchProductsAsync({ shouldFail: simulateError }));
    } else {
      refetchRtk();
    }
  };

  const rawProducts: Product[] =
    dataSource === 'thunk' ? thunkProducts : rtkProducts ?? [];
  const isLoading =
    dataSource === 'thunk' ? thunkStatus === 'loading' : isRtkLoading;
  const isError =
    dataSource === 'thunk' ? thunkStatus === 'failed' : isRtkError;
  const errorMessage =
    dataSource === 'thunk'
      ? thunkError
      : typeof rtkErrorObj === 'object' && rtkErrorObj && 'data' in rtkErrorObj
        ? String(rtkErrorObj.data)
        : 'Có lỗi xảy ra trong quá trình truy vấn RTK Query.';

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    if (selectedCategory !== 'Tất cả') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [rawProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div>
      {/* Top Bar: Tiêu đề và điều khiển mô phỏng */}
      <Card
        style={{
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: '#ffffff',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
        bodyStyle={{ padding: '14px 20px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={4} style={{ margin: 0, fontSize: 18, color: '#111827' }}>
              Danh Sách Thiết Bị & Phụ Kiện Công Nghệ
            </Title>
            <Space size={6} style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Đang nạp qua:
              </Text>
              {dataSource === 'thunk' ? (
                <Tag color="blue" icon={<ThunderboltOutlined />}>
                  createAsyncThunk (productsSlice)
                </Tag>
              ) : (
                <Tag color="green" icon={<span style={{ fontWeight: 700 }}>★</span>}>
                  RTK Query (productsApi - Điểm cộng ⭐)
                </Tag>
              )}
            </Space>
          </div>

          <Space size="middle" align="center">
            <Space align="center" size={8}>
              <Switch
                checked={simulateError}
                onChange={(checked) => setSimulateError(checked)}
                style={{ backgroundColor: simulateError ? '#ff4d4f' : undefined }}
              />
              <Text style={{ fontSize: 13, color: simulateError ? '#ff4d4f' : '#4b5563' }}>
                Mô phỏng lỗi Server 500
              </Text>
            </Space>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRetry}
              loading={isLoading}
              size="middle"
            >
              Refetch
            </Button>
          </Space>
        </div>
      </Card>

      {/* Bộ lọc sản phẩm */}
      <ProductFilter />

      {/* Trạng thái Loading với Skeleton Cards */}
      {isLoading && (
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Col xs={24} sm={12} md={8} lg={6} key={n}>
              <Card style={{ borderRadius: 8, height: 360 }}>
                <Skeleton.Image style={{ width: '100%', height: 160, marginBottom: 16 }} active />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Trạng thái Lỗi */}
      {!isLoading && isError && (
        <Card style={{ borderRadius: 8, textAlign: 'center', padding: '24px 0', border: '1px solid #fed7d7' }}>
          <Result
            status="500"
            title="Gặp lỗi khi tải dữ liệu sản phẩm"
            subTitle={errorMessage}
            extra={
              <Space direction="vertical" size="middle">
                {simulateError && (
                  <Alert
                    message="Bạn đang bật tùy chọn 'Mô phỏng lỗi Server 500'. Hãy tắt công tắc phía trên và nhấn thử lại."
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                  />
                )}
                <Button type="primary" onClick={handleRetry} icon={<ReloadOutlined />}>
                  Thử lại ngay
                </Button>
              </Space>
            }
          />
        </Card>
      )}

      {/* Trạng thái Thành Công */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}

      {/* Trạng thái Không có sản phẩm phù hợp */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <Card style={{ borderRadius: 8, padding: '48px 0', textAlign: 'center' }}>
          <Empty
            description={`Không tìm thấy sản phẩm nào thuộc danh mục "${selectedCategory}" hoặc từ khóa "${searchQuery}".`}
          />
        </Card>
      )}
    </div>
  );
}
