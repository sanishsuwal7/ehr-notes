import Link from 'next/link';
import patientData from '../shared/patientData.json';

export default function HomePage() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Select Patient Encounter</h1>
      <ul className='space-y-2'>
        {patientData.map(patient => (
          <li key={patient.id} className='border p-2 rounded hover:bg-gray-100'>
            <Link href={`/new-note/${patient.id}`}>{patient.name} - {patient.encounter}</Link>
          </li>
        ))}
      </ul>
    </div>
  )

}