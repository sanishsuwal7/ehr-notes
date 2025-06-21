import Link from 'next/link';
import {useNotes} from '../../hooks/useNotes';
import NoteCard from '@/components/NoteCard';

export default function NotesPage() {
    const {data: notes, isLoading} = useNotes();
 
    if(isLoading) return <p>Loading notes...</p>;

    return (
        <div className='p-4'>
            <div className='flex justify-between mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Saved Clinical Notes</h2>
                <Link href="/">
                    <button className="text-blue-600 underline">← Back to Patient List</button>
                </Link>
            </div>
            
            <ul className = "space-y-4">
                {notes.map(note => (
                    <NoteCard key={note.id} note={note} />
                ))}
            </ul>
        </div>

    )
}