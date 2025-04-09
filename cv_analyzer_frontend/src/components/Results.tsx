import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import type { AnalysisResults } from '../types';

interface ResultsProps {
  results: AnalysisResults;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onReset }) => {
  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold font-mono mb-4">Analysis Results</h2>
        <p className="flex items-center gap-2 mb-4">
          <FileText size={20} />
          <span className="font-mono">{results.filename}</span>
        </p>

        {/* Sections Analysis */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Document Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(results.analysis_results.sections_analysis).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                {value ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-red-600" size={20} />
                )}
                <span>
                  {key === 'contact' && 'Contact Information'}
                  {key === 'summary' && 'Professional Summary'}
                  {key === 'experience' && 'Work Experience'}
                  {key === 'education' && 'Education'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Length Analysis */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Length Analysis</h3>
          <p>{results.analysis_results.length_analysis}</p>
        </div>

        {/* Sensitive Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Sensitive Content</h3>
          {results.analysis_results.sensitive_content_warnings.length > 0 ? (
            <ul className="space-y-2">
              {results.analysis_results.sensitive_content_warnings.map((warning, index) => (
                <li key={index} className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={20} />
                  {warning}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600">No sensitive content detected</p>
          )}
        </div>

        {/* Action Verbs */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Action Verbs Analysis</h3>
          <p>{results.analysis_results.action_verb_analysis.feedback}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-blue-500 text-white font-bold border-4 border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1
              hover:shadow-none transition-all"
          >
            Analyze Another CV
          </button>
          <button
            className="px-6 py-3 bg-gray-200 text-black font-bold border-4 border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1
              hover:shadow-none transition-all"
          >
            Download Basic Templates
          </button>
        </div>
      </div>
    </div>
  );
};