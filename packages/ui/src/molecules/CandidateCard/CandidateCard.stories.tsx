import type { Meta, StoryObj } from '@storybook/react-vite';
import CandidateCard from './CandidateCard.component';
import { toCandidateId, type Candidate } from '@repo/types';

const base: Candidate = {
  id: toCandidateId(1),
  name: 'Alice Johnson',
  email: 'alice.johnson@example.com',
  phone: '+1-555-123-4567',
  position: 'Frontend Engineer',
  status: 'interview',
  experience: 4,
  location: 'San Francisco, CA',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  appliedAt: '2026-05-15T10:00:00Z',
};

const meta = {
  title: 'Molecules/CandidateCard',
  component: CandidateCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CandidateCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { candidate: base },
};

export const Hired: Story = {
  args: { candidate: { ...base, id: toCandidateId(2), status: 'hired', name: 'Bob Martinez', avatarUrl: 'https://i.pravatar.cc/150?img=2' } },
};

export const Rejected: Story = {
  args: { candidate: { ...base, id: toCandidateId(3), status: 'rejected', name: 'Carol White', avatarUrl: 'https://i.pravatar.cc/150?img=3' } },
};

export const NoAvatar: Story = {
  args: { candidate: { ...base, id: toCandidateId(4), avatarUrl: '' } },
};

export const LongContent: Story = {
  args: {
    candidate: {
      ...base,
      id: toCandidateId(5),
      name: 'Dr. Alexandra Pemberton-Worthington',
      position: 'Senior Principal Staff Engineering Manager',
      location: 'San Francisco Bay Area, California, United States',
      email: 'alexandra.pemberton-worthington@enterprise-corp.example.com',
    },
  },
};
