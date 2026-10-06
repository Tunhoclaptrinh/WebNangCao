import { usePinStore } from '../usePinStore';

describe('Unit Tests: Zustand usePinStore', () => {
  beforeEach(() => {
    usePinStore.getState().clearAllPins();
  });

  it('ghim và bỏ ghim bài tập thành công (togglePin)', () => {
    expect(usePinStore.getState().isPinned('task_1')).toBe(false);

    // Ghim task_1
    usePinStore.getState().togglePin('task_1');
    expect(usePinStore.getState().pinnedIds).toContain('task_1');
    expect(usePinStore.getState().isPinned('task_1')).toBe(true);

    // Ghim thêm task_2
    usePinStore.getState().togglePin('task_2');
    expect(usePinStore.getState().pinnedIds).toEqual(['task_1', 'task_2']);

    // Bỏ ghim task_1
    usePinStore.getState().togglePin('task_1');
    expect(usePinStore.getState().pinnedIds).toEqual(['task_2']);
    expect(usePinStore.getState().isPinned('task_1')).toBe(false);
  });

  it('xóa toàn bộ ghim bằng clearAllPins', () => {
    usePinStore.getState().togglePin('task_1');
    usePinStore.getState().togglePin('task_2');
    expect(usePinStore.getState().pinnedIds).toHaveLength(2);

    usePinStore.getState().clearAllPins();
    expect(usePinStore.getState().pinnedIds).toHaveLength(0);
  });
});
