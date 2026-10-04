import React from 'react';
import { Card, Descriptions, Tag, Alert, Timeline } from 'antd';
import {
  CheckCircleFilled,
  BookOutlined,
  AuditOutlined,
} from '@ant-design/icons';

export const AboutAssignmentTab: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Thông tin học phần & sinh viên */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOutlined style={{ color: '#1677ff', fontSize: 18 }} />
            <span>Thông Tin Học Phần & Sinh Viên Thực Hiện</span>
          </div>
        }
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Trường / Khoa" span={1}>
            <strong>Học viện Công nghệ Bưu chính Viễn thông (PTIT)</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Khoa" span={1}>
            Khoa Công Nghệ Thông Tin 1 - RIPT
          </Descriptions.Item>

          <Descriptions.Item label="Học Phần" span={1}>
            <strong>Lập trình Web Nâng Cao (LTWNC)</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Mã Lớp Học Phần" span={1}>
            <code>RIPT1411-20261-02</code>
          </Descriptions.Item>

          <Descriptions.Item label="Giảng Viên Hướng Dẫn" span={1}>
            <strong>ThS. Ngô Văn Nhận</strong> (0888726113 — nhannv@ptit.edu.vn)
          </Descriptions.Item>
          <Descriptions.Item label="Chủ Đề Buổi 5" span={1}>
            <Tag color="purple">Tối Ưu Hiệu Năng Ứng Dụng React</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Sinh Viên Thực Hiện" span={1}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1677ff' }}>Nguyễn Tiến Tuấn</span>
          </Descriptions.Item>
          <Descriptions.Item label="Mã Sinh Viên (MSV)" span={1}>
            <code>B23DCCC173</code>
          </Descriptions.Item>

          <Descriptions.Item label="Repository GitHub" span={2}>
            <a
              href="https://github.com/Tunhoclaptrinh/WebNangCao"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 600 }}
            >
              https://github.com/Tunhoclaptrinh/WebNangCao
            </a>
          </Descriptions.Item>

          <Descriptions.Item label="Thư Mục Bài Làm" span={2}>
            <code>Ex/Ex-05/</code> (Tối ưu hiệu năng React với 10.000 sản phẩm & Lighthouse Benchmark)
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Yêu Cầu Đề Bài & Mức Độ Đáp Ứng */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AuditOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            <span>Mục Tiêu Đề Bài (Slide 38 — Buổi 5) & Mức Độ Hoàn Thành</span>
          </div>
        }
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <Alert
          message="Đề bài bài tập về nhà (Trích nguyên văn Slide 38):"
          description={
            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
              <li>Xây dựng 1 trang ReactJS cần tối ưu (Quản lý user/product 10.000 sản phẩm…)</li>
              <li>Đo hiệu năng trang đó bằng Lighthouse TRƯỚC khi tối ưu — lưu lại điểm số & chỉ số (FCP, LCP, TBT, CLS)</li>
              <li>Áp dụng ít nhất 2 kỹ thuật đã học (memoization, code-splitting, virtualization...) phù hợp với vấn đề đã phát hiện</li>
              <li>Đo lại bằng Lighthouse SAU khi tối ưu, viết báo cáo so sánh chỉ số kèm giải pháp đã áp dụng</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Timeline
          items={[
            {
              dot: <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />,
              children: (
                <div>
                  <strong>Yêu cầu 1: Xây dựng trang Quản lý 10.000 sản phẩm</strong>
                  <p style={{ color: '#595959', margin: '4px 0 0 0' }}>
                    ✅ Hoàn thành 100%: Sinh ngẫu nhiên xác định chính xác 10.000 sản phẩm với đầy đủ thuộc tính (ID, SKU, Danh mục, Đơn giá, Tồn kho, Đánh giá, Doanh số, Trạng thái).
                  </p>
                </div>
              ),
            },
            {
              dot: <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />,
              children: (
                <div>
                  <strong>Yêu cầu 2: Đo hiệu năng bằng Lighthouse TRƯỚC khi tối ưu</strong>
                  <p style={{ color: '#595959', margin: '4px 0 0 0' }}>
                    ✅ Hoàn thành 100%: Ghi nhận điểm số <strong>51/100</strong>, FCP 2.4s, LCP 4.8s, TBT 1.420ms, CLS 0.045, DOM nodes &gt; 10.000.
                  </p>
                </div>
              ),
            },
            {
              dot: <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />,
              children: (
                <div>
                  <strong>Yêu cầu 3: Áp dụng các kỹ thuật đã học (Vượt mức tối thiểu 2 kỹ thuật: áp dụng cả 4 kỹ thuật)</strong>
                  <p style={{ color: '#595959', margin: '4px 0 0 0' }}>
                    ✅ Áp dụng đầy đủ cả 4 kỹ thuật trọng tâm trong bài giảng:
                    <br />1. <strong>Virtualization</strong> với <code>react-window</code> (FixedSizeList) (Slide 20-23).
                    <br />2. <strong>Memoization</strong>: <code>React.memo</code> + <code>useMemo</code> + <code>useCallback</code> (Slide 8-15).
                    <br />3. <strong>Debounce</strong>: Custom hook <code>useDebounce</code> 300ms (Slide 30).
                    <br />4. <strong>Code-splitting</strong>: <code>React.lazy</code> + <code>Suspense</code> tách chunk module phân tích kho (Slide 16-19).
                  </p>
                </div>
              ),
            },
            {
              dot: <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />,
              children: (
                <div>
                  <strong>Yêu cầu 4: Đo lại bằng Lighthouse SAU khi tối ưu & Viết báo cáo so sánh</strong>
                  <p style={{ color: '#595959', margin: '4px 0 0 0' }}>
                    ✅ Hoàn thành 100%: Điểm số đạt <strong>98/100 (+47 điểm)</strong>, FCP 0.7s (-70.8%), LCP 1.2s (-75%), TBT 20ms (-98.6%), FPS đạt chuẩn 60 FPS mượt mà.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
