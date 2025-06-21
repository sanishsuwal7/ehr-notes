export default function NoteCard({note}) {
    return (
         <li className="border p-3 rounded">
            <h3 className="font-bold">{note.patient_name}</h3>
            <p><strong>Subjective:</strong> {note.subjective}</p>
            <p><strong>Objective:</strong> {note.objective}</p>
            <p><strong>Assessment:</strong> {note.assessment}</p>
            <p><strong>Plan:</strong> {note.plan}</p>
        </li>
    )

}