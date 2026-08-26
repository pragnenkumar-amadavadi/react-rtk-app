import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import AddCandidateDialog from './AddCandidateDialog.component';

const meta = {
  title: 'Organisms/AddCandidateDialog',
  component: AddCandidateDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof AddCandidateDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { open: true },
};

export const Closed: Story = {
  args: { open: false },
};
