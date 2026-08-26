import { useState, type FormEvent } from 'react';
import type { Props } from './CandidateNotes.types';
import {
  SectionRoot,
  SectionTitle,
  NoteForm,
  NoteInput,
  SubmitButton,
  NoteList,
  NoteItem,
  NoteBody,
  NoteTimestamp,
  EmptyState,
  LoadingBox,
  NotesSpinner,
} from './CandidateNotes.styled';

export default function CandidateNotes({ notes, isLoading, isSubmitting, onAddNote }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setValue('');
  }

  return (
    <SectionRoot>
      <SectionTitle variant="h6">Notes</SectionTitle>

      <NoteForm onSubmit={handleSubmit}>
        <NoteInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Add a note about this candidate…"
          multiline
          minRows={2}
          fullWidth
        />
        <SubmitButton type="submit" variant="contained" disabled={isSubmitting || !value.trim()}>
          {isSubmitting ? 'Adding…' : 'Add Note'}
        </SubmitButton>
      </NoteForm>

      {isLoading ? (
        <LoadingBox>
          <NotesSpinner size={24} />
        </LoadingBox>
      ) : notes.length === 0 ? (
        <EmptyState variant="body2">No notes yet.</EmptyState>
      ) : (
        <NoteList>
          {notes.map((note) => (
            <NoteItem key={note.id}>
              <NoteBody variant="body2">{note.body}</NoteBody>
              <NoteTimestamp variant="caption">
                {new Date(note.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </NoteTimestamp>
            </NoteItem>
          ))}
        </NoteList>
      )}
    </SectionRoot>
  );
}
