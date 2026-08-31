// Shared by CandidateNotes and CandidateStatusHistory — both render a
// timestamped, newest-first activity list on CandidateDetailView.
export function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
