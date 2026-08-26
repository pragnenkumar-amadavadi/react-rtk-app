import { useEffect, useState } from 'react';
import type { Candidate } from '@repo/types';
import type { Props } from './CandidateFilterBar.types';
import {
  FilterBarRoot,
  SearchField,
  SearchIconAdornment,
  StatusChipRow,
  FilterChip,
  CountText,
} from './CandidateFilterBar.styled';

const STATUS_OPTIONS: { value: Candidate['status']; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

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
        {STATUS_OPTIONS.map(({ value, label }) => (
          <FilterChip
            key={value}
            label={label}
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
