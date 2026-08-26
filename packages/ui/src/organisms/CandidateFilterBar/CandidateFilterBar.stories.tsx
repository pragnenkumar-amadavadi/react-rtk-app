import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import CandidateFilterBar from './CandidateFilterBar.component';

const meta = {
  title: 'Organisms/CandidateFilterBar',
  component: CandidateFilterBar,
  tags: ['autodocs'],
  args: {
    status: [],
    shownCount: 20,
    totalCount: 100,
    isInitialLoading: false,
    onSearchChange: fn(),
    onStatusChange: fn(),
  },
} satisfies Meta<typeof CandidateFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveFilters: Story = {
  args: { status: ['screening', 'interview'], shownCount: 8, totalCount: 100 },
};

export const Loading: Story = {
  args: { isInitialLoading: true, shownCount: 0 },
};
