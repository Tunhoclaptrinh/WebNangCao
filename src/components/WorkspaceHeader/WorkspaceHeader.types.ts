export interface WorkspaceHeaderProps {
  title: string;
  count: number;
  isFiltered: boolean;
  viewMode: 'list' | 'board';
  loading: boolean;
  showStats?: boolean;
  onClearFilters: () => void;
  onViewModeChange: (mode: 'list' | 'board') => void;
  onOpenTechDrawer: () => void;
  onResetMockData: () => void;
  onOpenCreateModal: () => void;
  onGenerate10k?: () => void;
  onToggleStats?: () => void;
}
