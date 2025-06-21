import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import patientData from '../../shared/patientData.json';

export default function NewNotePage() {
  const router = useRouter();
  const { id } = router.query;
  const patient = patientData.find(p => p.id === id);
  const [activeTab, setActiveTab] =  useState<'form' | 'record'>('form');
  const [form, setForm] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [note, setNote] = useState(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any[]>([]);

  const startRecording = async() => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e:any) => audioChunksRef.current.push(e.data)
      mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, {type:'audio/wav'});
          const formData = new FormData();
          formData.append('file', blob, 'reacording.wav');

          const res = await fetch('http://localhost:8000/transcribe',{
              method:'POST',
              body: formData
          });
          const data = await res.json();
          setTranscript(data.transcript)
          setNote(data.note);
          
      };
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setRecording(true);
  }

  const stopRecording = () => {
      mediaRecorderRef.current.stop();
      setRecording(false);
  }

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

  const handleRecording = async (note) => {
    const payload = {
      patient_id: patient.id,
      patient_name: patient.name,
      ...note
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
      <h1 className="text-2xl font-bold mb-4">Create SOAP Note for {patient.name}</h1>
      <div className="mb-4 space-x-4">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Fill Manually
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`px-4 py-2 rounded ${activeTab === 'record' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Record Audio
        </button>
      </div>

      {activeTab === 'form' && (
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
      )}

      {activeTab === 'record' && (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Record a Conversation</h1>
            <div className="mb-4">
                <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-500' : 'bg-blue-600'}`}
                >
                {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>

             {transcript && (
                <div className="mt-4">
                <h2 className="text-lg font-semibold">Transcript:</h2>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{transcript}</p>
                </div>
            )}
            {note && (
                <div className="mt-4 border p-4 rounded bg-gray-100">
                <h2 className="font-bold">Generated Note</h2>
                <p><strong>Subjective:</strong> {note.subjective}</p>
                <p><strong>Objective:</strong> {note.objective}</p>
                <p><strong>Assessment:</strong> {note.assessment}</p>
                <p><strong>Plan:</strong> {note.plan}</p>
                </div>
            )}
            <button onClick={() => handleRecording(note)} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </div>
      )}
    </div>
    
  );
}