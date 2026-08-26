import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CANDIDATE_STATUSES, type Candidate } from '@repo/types';
import { STATUS_LABELS } from '../../atoms/StatusChip';
import type { Props } from './BulkStatusToolbar.types';
import { ToolbarRoot, SelectionText, MoveButton, StyledMenu, ClearButton } from './BulkStatusToolbar.styled';

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
        {CANDIDATE_STATUSES.map((value) => (
          <MenuItem key={value} onClick={() => handleSelect(value)}>
            {STATUS_LABELS[value]}
          </MenuItem>
        ))}
      </StyledMenu>
      <ClearButton size="small" onClick={onClear}>
        Clear
      </ClearButton>
    </ToolbarRoot>
  );
}
