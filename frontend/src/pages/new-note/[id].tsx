import { useRouter } from 'next/router';
import { useState } from 'react';
import patientData from '../../shared/patientData.json';

export default function NewNotePage() {
  const router = useRouter();
  const { id } = router.query;
  const patient = patientData.find(p => p.id === id);

  const [form, setForm] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const handleChange = (e: any) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      patient_id: patient.id,
      patient_name: patient.name,
      ...form
    };
    await fetch('http://localhost:8000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    router.push('/notes');
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">SOAP Note for {patient.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['subjective', 'objective', 'assessment', 'plan'].map(field => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <textarea
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}