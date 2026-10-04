import React from 'react';
import { Card, Row, Col, Switch, Tag, Tooltip, Button, Space } from 'antd';
import {
  ThunderboltOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  NodeIndexOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  BarChartOutlined,
} from '@ant-design/icons';

interface PerformanceDashboardProps {
  isOptimized: boolean;
  onToggleOptimized: (checked: boolean) => void;
  renderDuration: number;
  domNodeCount: number;
  filteredCount: number;
  totalCount: number;
  fps: number;
  onOpenAnalytics: () => void;
  onOpenAuditLog?: () => void;
  useVirtualization: boolean;
  onToggleVirtualization: (checked: boolean) => void;
  useMemoization: boolean;
  onToggleMemoization: (checked: boolean) => void;
  useDebounceSearch: boolean;
  onToggleDebounce: (checked: boolean) => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isOptimized,
  onToggleOptimized,
  renderDuration,
  domNodeCount,
  filteredCount,
  totalCount,
  fps,
  onOpenAnalytics,
  useVirtualization,
  onToggleVirtualization,
  useMemoization,
  onToggleMemoization,
  useDebounceSearch,
  onToggleDebounce,
}) => {
  const getFpsColor = (val: number) => {
    if (val >= 55) return '#52c41a';
    if (val >= 35) return '#faad14';
    return '#cf1322';
  };

  const getRenderTimeColor = (val: number) => {
    if (val <= 50) return '#52c41a';
    if (val <= 300) return '#faad14';
    return '#cf1322';
  };

  return (
    <Card
      style={{
        marginBottom: 20,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: isOptimized ? '2px solid #b7eb8f' : '2px solid #ffa39e',
        background: isOptimized
          ? 'linear-gradient(180deg, #f6ffed 0%, #ffffff 100%)'
          : 'linear-gradient(180deg, #fff1f0 0%, #ffffff 100%)',
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      {/* Hàng 1: Switch chế độ tổng & Giới thiệu */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 16,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: isOptimized ? '#52c41a' : '#ff4d4f',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: isOptimized
                ? '0 4px 10px rgba(82, 196, 26, 0.35)'
                : '0 4px 10px rgba(255, 77, 79, 0.35)',
            }}
          >
            {isOptimized ? <ThunderboltOutlined /> : <DashboardOutlined />}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1f1f1f' }}>
                {isOptimized ? 'CHẾ ĐỘ ĐÃ TỐI ƯU (OPTIMIZED)' : 'CHẾ ĐỘ CHƯA TỐI ƯU (UNOPTIMIZED)'}
              </span>
              <Tag color={isOptimized ? 'success' : 'error'} style={{ fontWeight: 600 }}>
                {isOptimized ? '⚡ Performance 98-100' : '⚠️ Performance 45-55'}
              </Tag>
            </div>
            <div style={{ fontSize: 13, color: '#595959', marginTop: 2 }}>
              {isOptimized
                ? 'Kích hoạt Virtualization (react-window) + Memoization (React.memo/useMemo/useCallback) + useDebounce (300ms) + Code-splitting.'
                : 'Render trực tiếp toàn bộ 10.000 items vào DOM (.map) không virtualize, không memo hóa component, không debounce search.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={onOpenAnalytics}
            style={{ backgroundColor: '#1677ff' }}
          >
            Mở Phân Tích Kho (Lazy Chunk)
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              borderRadius: 8,
              border: '1px solid #d9d9d9',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>Chuyển nhanh chế độ:</span>
            <Switch
              checkedChildren="⚡ TỐI ƯU"
              unCheckedChildren="🐢 CHƯA TỐI ƯU"
              checked={isOptimized}
              onChange={onToggleOptimized}
            />
          </div>
        </div>
      </div>

      {/* Hàng 2: Các thẻ số liệu Benchmark thời gian thực */}
      <Row gutter={[16, 12]} style={{ marginTop: 16 }}>
        <Col xs={12} sm={6} md={6}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
            }}
          >
            <div style={{ fontSize: 12, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FieldTimeOutlined /> Thời Gian Render (CPU)
              <Tooltip title="Thời gian từ lúc kích hoạt render đến khi commit hoàn tất vào DOM">
                <InfoCircleOutlined style={{ fontSize: 11 }} />
              </Tooltip>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: getRenderTimeColor(renderDuration), marginTop: 4 }}>
              {renderDuration} ms
            </div>
            <div style={{ fontSize: 11, color: isOptimized ? '#52c41a' : '#cf1322' }}>
              {isOptimized ? '⚡ Cực nhanh (< 35ms)' : '⚠️ Chậm trễ do render 10k nodes'}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} md={6}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
            }}
          >
            <div style={{ fontSize: 12, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}>
              <NodeIndexOutlined /> DOM Nodes Trong View
              <Tooltip title="Số lượng phần tử DOM thực tế đang được mount trên Document">
                <InfoCircleOutlined style={{ fontSize: 11 }} />
              </Tooltip>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: isOptimized ? '#52c41a' : '#cf1322', marginTop: 4 }}>
              ~{domNodeCount.toLocaleString('vi-VN')}
            </div>
            <div style={{ fontSize: 11, color: isOptimized ? '#52c41a' : '#cf1322' }}>
              {isOptimized ? 'Tiết kiệm 99.8% DOM nodes' : '10.000 nodes gây tràn bộ nhớ'}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} md={6}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
            }}
          >
            <div style={{ fontSize: 12, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}>
              <DashboardOutlined /> Độ Mượt Khung Hình (FPS)
              <Tooltip title="Đo lường thời gian thực bằng requestAnimationFrame khi người dùng cuộn hoặc tương tác">
                <InfoCircleOutlined style={{ fontSize: 11 }} />
              </Tooltip>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: getFpsColor(fps), marginTop: 4 }}>
              {fps} FPS
            </div>
            <div style={{ fontSize: 11, color: fps >= 55 ? '#52c41a' : '#cf1322' }}>
              {fps >= 55 ? 'Mượt mà chuẩn 60 FPS' : 'Hiện tượng giật hình (Jank)'}
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6} md={6}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
            }}
          >
            <div style={{ fontSize: 12, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}>
              <SyncOutlined /> Dữ Liệu Khớp Bộ Lọc
              <Tooltip title="Tổng số bản ghi sản phẩm phù hợp với bộ lọc hiện hành">
                <InfoCircleOutlined style={{ fontSize: 11 }} />
              </Tooltip>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1677ff', marginTop: 4 }}>
              {filteredCount.toLocaleString('vi-VN')} <span style={{ fontSize: 13, fontWeight: 400, color: '#8c8c8c' }}>/ {totalCount.toLocaleString('vi-VN')}</span>
            </div>
            <div style={{ fontSize: 11, color: '#595959' }}>
              Kho dữ liệu 10.000 sản phẩm
            </div>
          </div>
        </Col>
      </Row>

      {/* Hàng 3: Bảng công tắc các kỹ thuật tối ưu độc lập */}
      <div
        style={{
          marginTop: 16,
          padding: '10px 14px',
          backgroundColor: '#fafafa',
          borderRadius: 8,
          border: '1px dashed #d9d9d9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#595959' }}>
          🛠️ Các kỹ thuật tối ưu đang áp dụng (Bật/tắt để kiểm chứng độc lập):
        </span>

        <Space size="middle" wrap>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Switch
              size="small"
              checked={useVirtualization}
              onChange={onToggleVirtualization}
            />
            <span>Virtualization (react-window)</span>
            {useVirtualization ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#ff4d4f' }} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Switch
              size="small"
              checked={useMemoization}
              onChange={onToggleMemoization}
            />
            <span>Memoization (memo, useMemo, useCallback)</span>
            {useMemoization ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#ff4d4f' }} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Switch
              size="small"
              checked={useDebounceSearch}
              onChange={onToggleDebounce}
            />
            <span>useDebounce (300ms)</span>
            {useDebounceSearch ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#ff4d4f' }} />}
          </div>
        </Space>
      </div>
    </Card>
  );
};
