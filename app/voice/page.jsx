'use client';
import { useState } from 'react';

const Page = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={(e) => handleSubmit(e)} />
      {result && (
        <div>
          <h2>Transcription Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Page;
