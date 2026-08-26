import { useEffect, useState } from 'react';
import { CANDIDATE_STATUSES, type Candidate } from '@repo/types';
import { STATUS_LABELS } from '../../atoms/StatusChip';
import type { Props } from './CandidateFilterBar.types';
import {
  FilterBarRoot,
  SearchField,
  SearchIconAdornment,
  StatusChipRow,
  FilterChip,
  CountText,
} from './CandidateFilterBar.styled';

const SEARCH_DEBOUNCE_MS = 300;

export default function CandidateFilterBar({
  status,
  shownCount,
  totalCount,
  isInitialLoading,
  onSearchChange,
  onStatusChange,
}: Props) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(inputValue), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange]);

  function toggleStatus(value: Candidate['status']) {
    onStatusChange(status.includes(value) ? status.filter((s) => s !== value) : [...status, value]);
  }

  return (
    <FilterBarRoot>
      <SearchField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by name, email, or position"
        size="small"
        fullWidth
        slotProps={{ input: { startAdornment: <SearchIconAdornment /> } }}
      />
      <StatusChipRow>
        {CANDIDATE_STATUSES.map((value) => (
          <FilterChip
            key={value}
            label={STATUS_LABELS[value]}
            clickable
            size="small"
            color={status.includes(value) ? 'primary' : 'default'}
            variant={status.includes(value) ? 'filled' : 'outlined'}
            onClick={() => toggleStatus(value)}
          />
        ))}
      </StatusChipRow>
      <CountText variant="body2">
        {isInitialLoading ? 'Loading candidates…' : `Showing ${shownCount} of ${totalCount}`}
      </CountText>
    </FilterBarRoot>
  );
}
