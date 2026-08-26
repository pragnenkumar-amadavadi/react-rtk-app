import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import BulkStatusToolbar from './BulkStatusToolbar.component';

const meta = {
  title: 'Organisms/BulkStatusToolbar',
  component: BulkStatusToolbar,
  tags: ['autodocs'],
  args: {
    onMoveToStatus: fn(),
    onClear: fn(),
  },
} satisfies Meta<typeof BulkStatusToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FewSelected: Story = {
  args: { selectedCount: 4 },
};

export const ManySelected: Story = {
  args: { selectedCount: 23 },
};

export const Updating: Story = {
  args: { selectedCount: 4, isUpdating: true },
};

export const NoneSelected: Story = {
  args: { selectedCount: 0 },
};
