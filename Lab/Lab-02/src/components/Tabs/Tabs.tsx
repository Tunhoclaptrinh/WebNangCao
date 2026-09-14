/**
 * Tabs — Bài Thực Hành 2/3
 * Compound Component Pattern với Context API.
 *
 * Cách dùng:
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab value="tab1">Giới thiệu</Tabs.Tab>
 *     <Tabs.Tab value="tab2">Chi tiết</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="tab1">Nội dung 1</Tabs.Panel>
 *   <Tabs.Panel value="tab2">Nội dung 2</Tabs.Panel>
 * </Tabs>
 * ```
 */

import { useState, type ReactNode } from "react";
import { TabsContext, useTabsContext } from "../../contexts/TabsContext";

// ─── Types ───────────────────────────────────────────
interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

interface TabsListProps {
  children: ReactNode;
}

interface TabsTabProps {
  value: string;
  children: ReactNode;
}

interface TabsPanelProps {
  value: string;
  children: ReactNode;
}

// ─── Root Component ───────────────────────────────────
/**
 * Tabs — Root component, quản lý state và cung cấp Context.
 */
function TabsRoot({ defaultValue, children }: TabsProps) {
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// ─── Tabs.List ────────────────────────────────────────
/** Chứa danh sách các Tabs.Tab */
function TabsList({ children }: TabsListProps) {
  return (
    <div className="tabs-list" role="tablist">
      {children}
    </div>
  );
}

// ─── Tabs.Tab (nút bấm) ───────────────────────────────
/** Nút bấm để chuyển tab */
function TabsTab({ value, children }: TabsTabProps) {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      className={`tabs-tab ${isActive ? "tabs-tab--active" : ""}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabs-panel-${value}`}
      id={`tabs-tab-${value}`}
      onClick={() => setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
}

// ─── Tabs.Panel (nội dung) ────────────────────────────
/** Hiển thị nội dung khi tab tương ứng được chọn */
function TabsPanel({ value, children }: TabsPanelProps) {
  const { value: activeValue } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div
      className="tabs-panel"
      role="tabpanel"
      id={`tabs-panel-${value}`}
      aria-labelledby={`tabs-tab-${value}`}
    >
      {children}
    </div>
  );
}

// ─── Gán sub-components (dot notation) ───────────────
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
