import ColorSchemeToggle from '../../atoms/ColorSchemeToggle';
import type { Props } from './AppNav.types';
import { StyledAppBar, StyledToolbar, NavLinks, NavItem } from './AppNav.styled';

export default function AppNav({ onCandidatesHover, onJobsHover, onDashboardHover }: Props) {
  return (
    <StyledAppBar position="sticky" color="default">
      <StyledToolbar variant="dense">
        <NavLinks>
          <NavItem to="/" onMouseEnter={onCandidatesHover}>
            Candidates
          </NavItem>
          <NavItem to="/jobs" onMouseEnter={onJobsHover}>
            Jobs
          </NavItem>
          <NavItem to="/dashboard" onMouseEnter={onDashboardHover}>
            Dashboard
          </NavItem>
        </NavLinks>
        <ColorSchemeToggle />
      </StyledToolbar>
    </StyledAppBar>
  );
}
