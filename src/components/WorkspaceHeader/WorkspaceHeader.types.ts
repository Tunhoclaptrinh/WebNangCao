export interface WorkspaceHeaderProps {
  title: string;
  count: number;
  isFiltered: boolean;
  viewMode: 'list' | 'board';
  loading: boolean;
  onClearFilters: () => void;
  onViewModeChange: (mode: 'list' | 'board') => void;
  onOpenTechDrawer: () => void;
  onResetMockData: () => void;
  onOpenCreateModal: () => void;
}
