import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

export const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted, disabled }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    disabled,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full max-w-2xl p-8 border-4 border-black bg-white
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        transition-transform hover:translate-x-1 hover:translate-y-1
        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        ${isDragActive ? 'bg-blue-50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload size={48} className="text-black" />
        <h3 className="text-2xl font-bold font-mono">Drop your CV here</h3>
        <p className="text-lg">or click to select file</p>
        <p className="text-sm text-gray-600">Accepted formats: PDF, DOCX (Max 10MB)</p>
      </div>
    </div>
  );
};