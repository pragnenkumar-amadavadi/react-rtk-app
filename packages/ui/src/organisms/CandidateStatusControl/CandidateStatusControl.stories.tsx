import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import CandidateStatusControl from './CandidateStatusControl.component';

const meta = {
  title: 'Organisms/CandidateStatusControl',
  component: CandidateStatusControl,
  tags: ['autodocs'],
  args: {
    onStatusChange: fn(),
  },
} satisfies Meta<typeof CandidateStatusControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Applied: Story = {
  args: { status: 'applied' },
};

export const Screening: Story = {
  args: { status: 'screening' },
};

export const Offer: Story = {
  args: { status: 'offer' },
};

export const Hired: Story = {
  args: { status: 'hired' },
};

export const Rejected: Story = {
  args: { status: 'rejected' },
};

export const Updating: Story = {
  args: { status: 'applied', isUpdating: true },
};
