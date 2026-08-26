import type { Props } from './AppNav.types';
import { StyledAppBar, StyledToolbar, NavItem } from './AppNav.styled';

export default function AppNav({ onCandidatesHover, onJobsHover }: Props) {
  return (
    <StyledAppBar position="sticky" color="default">
      <StyledToolbar variant="dense">
        <NavItem to="/" onMouseEnter={onCandidatesHover}>
          Candidates
        </NavItem>
        <NavItem to="/jobs" onMouseEnter={onJobsHover}>
          Jobs
        </NavItem>
      </StyledToolbar>
    </StyledAppBar>
  );
}
