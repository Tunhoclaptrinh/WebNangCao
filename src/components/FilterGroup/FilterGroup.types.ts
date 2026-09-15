import React from 'react';
import { FilterContextType } from './FilterContext';

export interface FilterGroupProps extends FilterContextType {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
