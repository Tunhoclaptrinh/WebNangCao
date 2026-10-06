import { generate10kAssignments } from '../generate10kAssignments';

describe('Unit Tests: generate10kAssignments (Stress Test Generator)', () => {
  it('sinh chính xác số lượng bài tập theo tham số yêu cầu (mặc định 10.000)', () => {
    const list = generate10kAssignments(100);
    expect(list).toHaveLength(100);

    const first = list[0];
    expect(first.id).toBe('assign_stress_1');
    expect(first.title).toBeDefined();
    expect(first.subject).toBeDefined();
    expect(first.priority).toBeDefined();
    expect(first.dueDate).toBeDefined();
    expect(typeof first.completed).toBe('boolean');
  });

  it('phân bổ đa dạng môn học và độ ưu tiên', () => {
    const list = generate10kAssignments(50);
    const subjects = new Set(list.map((a) => a.subject));
    const priorities = new Set(list.map((a) => a.priority));

    expect(subjects.size).toBeGreaterThanOrEqual(4);
    expect(priorities.size).toBe(4);
  });
});
