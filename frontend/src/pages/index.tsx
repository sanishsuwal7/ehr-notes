import Link from 'next/link';
import patientData from '../shared/patientData.json';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-5xl mx-auto flex justify-between">
          <Link href="/">
            <span className="font-bold text-lg">Clinical Notes</span>
          </Link>
          <div className='flex gap-4'>
            <Link href="/record">
            <span className="hover:underline">Record</span>
          </Link>
          <Link href="/notes">
            <span className="hover:underline">View Notes</span>
          </Link>
          </div>
          
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Select Patient Encounter</h1>
        <div className="grid gap-4">
          {patientData.map(patient => (
            <Link key={patient.id} href={`/new-note/${patient.id}`}
              className="block border rounded-lg p-4 bg-white shadow hover:bg-blue-50 transition">
              <h2 className="text-xl font-semibold">{patient.name}</h2>
              <p className="text-gray-600">{patient.encounter}</p>
              <p className="text-sm text-gray-400">DOB: {patient.dob}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}