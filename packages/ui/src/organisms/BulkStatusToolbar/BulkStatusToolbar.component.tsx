import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { Candidate } from '@repo/types';
import type { Props } from './BulkStatusToolbar.types';
import { ToolbarRoot, SelectionText, MoveButton, StyledMenu, ClearButton } from './BulkStatusToolbar.styled';

const STATUS_OPTIONS: { value: Candidate['status']; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

export default function BulkStatusToolbar({ selectedCount, isUpdating = false, onMoveToStatus, onClear }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (selectedCount === 0) return null;

  function handleSelect(status: Candidate['status']) {
    setAnchorEl(null);
    onMoveToStatus(status);
  }

  return (
    <ToolbarRoot>
      <SelectionText variant="body2">{selectedCount} selected</SelectionText>
      <MoveButton
        size="small"
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        disabled={isUpdating}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Move to
      </MoveButton>
      <StyledMenu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <MenuItem key={value} onClick={() => handleSelect(value)}>
            {label}
          </MenuItem>
        ))}
      </StyledMenu>
      <ClearButton size="small" onClick={onClear}>
        Clear
      </ClearButton>
    </ToolbarRoot>
  );
}
