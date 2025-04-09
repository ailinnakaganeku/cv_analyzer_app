import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { Dropzone } from './components/Dropzone';
import { Results } from './components/Results';
import type { UploadState } from './types';

const API_URL = `${import.meta.env.VITE_API_URL}/cv/analyze`;

function App() {
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    results: null
  });

  const handleFileUpload = async (file: File) => {
    setState({ isLoading: true, error: null, results: null });

    const formData = new FormData();
    formData.append('cv_file', file);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setState({
        isLoading: false,
        error: null,
        results: response.data
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      const errorMessage = axiosError.response?.data?.detail || 'Error analyzing CV. Please try again.';
      
      setState({
        isLoading: false,
        error: errorMessage,
        results: null
      });
    }
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      error: null,
      results: null
    });
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4">CV Analyzer - MVP</h1>
          <p className="text-xl">Upload your CV for instant analysis</p>
        </header>

        <main className="flex flex-col items-center gap-8">
          {state.error && (
            <div className="w-full max-w-2xl p-4 bg-red-100 border-4 border-black text-red-700 font-bold
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {state.error}
            </div>
          )}

          {state.isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="text-xl font-bold">Analyzing your CV...</p>
            </div>
          ) : state.results ? (
            <Results results={state.results} onReset={handleReset} />
          ) : (
            <Dropzone
              onFileAccepted={handleFileUpload}
              disabled={state.isLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;