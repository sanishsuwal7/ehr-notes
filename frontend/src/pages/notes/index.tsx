import {useNotes} from '../../hooks/useNotes';

export default function NotesPage() {
    const {data: notes, isLoading} = useNotes();
 
    if(isLoading) return <p>Loading notes...</p>;

    return (
        <div className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Saved Clinical Notes</h2>
            <ul className = "space-y-4">
                {notes.map(note => (
                    <li key={note.id} className='border p-3 rounded'>
                        <h3 className='font-bold'>{note.patient_name}</h3>
                        <p><strong>Subjective:</strong> {note.subjective}</p>
                        <p><strong>Objective:</strong> {note.objective}</p>
                        <p><strong>Assessment:</strong> {note.assessment}</p>
                        <p><strong>Plan:</strong> {note.plan}</p>
                    </li>
                ))}
            </ul>
        </div>

    )


}