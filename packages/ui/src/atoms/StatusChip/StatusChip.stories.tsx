import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusChip from './StatusChip.component';

const meta = {
  title: 'Atoms/StatusChip',
  component: StatusChip,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Applied: Story = { args: { status: 'applied' } };
export const Screening: Story = { args: { status: 'screening' } };
export const Interview: Story = { args: { status: 'interview' } };
export const Offer: Story = { args: { status: 'offer' } };
export const Hired: Story = { args: { status: 'hired' } };
export const Rejected: Story = { args: { status: 'rejected' } };
