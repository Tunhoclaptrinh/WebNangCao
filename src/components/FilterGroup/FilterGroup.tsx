import React from 'react';
import { FilterContext } from './FilterContext';
import { FilterGroupProps } from './FilterGroup.types';
import { StatusFilter } from './StatusFilter';
import { SubjectFilter } from './SubjectFilter';
import { PriorityFilter } from './PriorityFilter';
import { SearchFilter } from './SearchFilter';
import { ActionFilter } from './ActionFilter';
import './FilterGroup.css';

// -------------------------------------------------------------
// Component Cha: FilterGroup (Compound Component Pattern)
// -------------------------------------------------------------
export const FilterGroup: React.FC<FilterGroupProps> & {
  Status: typeof StatusFilter;
  Subject: typeof SubjectFilter;
  Priority: typeof PriorityFilter;
  Search: typeof SearchFilter;
  Actions: typeof ActionFilter;
} = ({ children, className = '', style, ...contextValue }) => {
  return (
    <FilterContext.Provider value={contextValue}>
      <div 
        className={`filter-group ${className}`} 
        style={style}
      >
        {children}
      </div>
    </FilterContext.Provider>
  );
};

// Gắn các sub-components độc lập vào Component cha (Compound Component Pattern)
FilterGroup.Status = StatusFilter;
FilterGroup.Subject = SubjectFilter;
FilterGroup.Priority = PriorityFilter;
FilterGroup.Search = SearchFilter;
FilterGroup.Actions = ActionFilter;
