import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import CandidateListView from './CandidateListView.component';
import { toCandidateId, type Candidate } from '@repo/types';

const mockCandidates: Candidate[] = [
  {
    id: toCandidateId(1),
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1-555-123-4567',
    position: 'Frontend Developer',
    status: 'interview',
    experience: 4,
    location: 'San Francisco, CA',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    appliedAt: '2026-05-15T10:00:00Z',
  },
  {
    id: toCandidateId(2),
    name: 'Bob Martinez',
    email: 'bob.martinez@example.com',
    phone: '+1-555-987-6543',
    position: 'Backend Developer',
    status: 'screening',
    experience: 7,
    location: 'New York, NY',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    appliedAt: '2026-05-20T09:00:00Z',
  },
  {
    id: toCandidateId(3),
    name: 'Carol White',
    email: 'carol.white@example.com',
    phone: '+1-555-456-7890',
    position: 'DevOps Engineer',
    status: 'hired',
    experience: 10,
    location: 'Austin, TX',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    appliedAt: '2026-04-10T14:00:00Z',
  },
  {
    id: toCandidateId(4),
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1-555-321-6547',
    position: 'Product Manager',
    status: 'applied',
    experience: 2,
    location: 'Remote',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    appliedAt: '2026-06-01T11:00:00Z',
  },
  {
    id: toCandidateId(5),
    name: 'Eva Davis',
    email: 'eva.davis@example.com',
    phone: '+1-555-654-3210',
    position: 'UX Designer',
    status: 'rejected',
    experience: 5,
    location: 'Seattle, WA',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    appliedAt: '2026-05-28T16:00:00Z',
  },
];

const meta = {
  title: 'Candidates/CandidateListView',
  component: CandidateListView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    status: [],
    loadMore: fn(),
    onAddClick: fn(),
    onDialogClose: fn(),
    onDialogSubmit: fn(),
    onCardHover: fn(),
    onSearchChange: fn(),
    onStatusChange: fn(),
  },
} satisfies Meta<typeof CandidateListView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewMode: Story = {
  name: 'View mode',
  args: {
    candidates: mockCandidates,
    total: mockCandidates.length,
    isLoading: false,
    hasMore: true,
    isError: false,
    dialogOpen: false,
  },
};

export const EditMode: Story = {
  name: 'Edit mode (dialog open)',
  args: {
    candidates: mockCandidates,
    total: mockCandidates.length,
    isLoading: false,
    hasMore: true,
    isError: false,
    dialogOpen: true,
  },
};

export const SkeletonLoading: Story = {
  name: 'Loading (skeleton)',
  args: {
    candidates: [],
    total: 0,
    isLoading: true,
    hasMore: false,
    isError: false,
    dialogOpen: false,
  },
};

export const LoadingMore: Story = {
  name: 'Loading more (spinner)',
  args: {
    candidates: mockCandidates,
    total: mockCandidates.length,
    isLoading: true,
    hasMore: true,
    isError: false,
    dialogOpen: false,
  },
};

export const Error: Story = {
  name: 'Error state',
  args: {
    candidates: [],
    total: 0,
    isLoading: false,
    hasMore: false,
    isError: true,
    dialogOpen: false,
  },
};

const breakpointArgs = {
  candidates: mockCandidates,
  total: mockCandidates.length,
  isLoading: false,
  hasMore: true,
  isError: false,
  dialogOpen: false,
};

export const Mobile: Story = {
  name: 'Breakpoint — Mobile (375px)',
  args: breakpointArgs,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const Tablet: Story = {
  name: 'Breakpoint — Tablet (768px)',
  args: breakpointArgs,
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const Desktop: Story = {
  name: 'Breakpoint — Desktop (1280px)',
  args: breakpointArgs,
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};
