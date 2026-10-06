import type { Assignment, SubjectCode, Priority } from '../types/assignment.types';

const SUBJECTS: SubjectCode[] = ['LTWNC', 'CSDL', 'KTMT', 'MMT', 'OOP', 'OTHER'];
const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const SAMPLE_TITLES = [
  'Bài tập thực hành React Virtualization & Performance',
  'Xây dựng Redux Toolkit Middleware & Zustand Store',
  'Thiết kế CSDL quan hệ chuẩn 3NF cho E-commerce',
  'Mô phỏng giao thức TCP/IP và phân tích gói tin Wireshark',
  'Lập trình Socket TCP đa luồng gửi nhận tệp tin',
  'Thiết kế hệ thống vi xử lý ARM và bộ nhớ Cache',
  'Áp dụng Design Pattern Factory & Observer trong Java',
  'Tối ưu câu truy vấn SQL với Clustered Index',
  'Viết Unit Test & Integration Test với Jest & RTL',
  'Xây dựng RESTful API với Express.js và JWT Auth',
  'Triển khai ứng dụng Docker Container trên Linux Server',
  'Báo cáo đồ án môn học giai đoạn giữa kỳ',
];

/**
 * Sinh nhanh 10.000 bài tập mẫu phục vụ stress test và benchmark hiệu năng
 */
export function generate10kAssignments(count: number = 10000): Assignment[] {
  const items: Assignment[] = new Array(count);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const id = `assign_stress_${i + 1}`;
    const subject = SUBJECTS[i % SUBJECTS.length];
    const priority = PRIORITIES[i % PRIORITIES.length];
    const baseTitle = SAMPLE_TITLES[i % SAMPLE_TITLES.length];
    const title = `${baseTitle} #${i + 1}`;
    
    // Phân bổ ngày: 20% quá hạn, 10% hôm nay, 70% tương lai
    let offsetDays: number;
    const mod = i % 10;
    if (mod < 2) {
      offsetDays = - (1 + (i % 15)); // Quá hạn 1-15 ngày
    } else if (mod === 2) {
      offsetDays = 0; // Hôm nay
    } else {
      offsetDays = 1 + (i % 30); // Tương lai 1-30 ngày
    }

    const dueDate = new Date(now + offsetDays * 86400000 + ((i * 3600000) % 86400000)).toISOString();
    const completed = i % 4 === 0; // 25% completed

    items[i] = {
      id,
      title,
      subject,
      dueDate,
      priority,
      completed,
      description: `Mô tả chi tiết bài tập mẫu #${i + 1} môn ${subject}. Yêu cầu hoàn thành đúng tiến độ đề ra.`,
      createdAt: new Date(now - 7 * 86400000).toISOString(),
      completedAt: completed ? new Date(now - 1 * 86400000).toISOString() : undefined,
    };
  }

  return items;
}
