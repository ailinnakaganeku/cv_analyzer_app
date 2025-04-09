export interface AnalysisResults {
  filename: string;
  detail: string;
  analysis_results: {
    sections_analysis: {
      contact: boolean;
      summary: boolean;
      experience: boolean;
      education: boolean;
    };
    length_analysis: string;
    sensitive_content_warnings: string[];
    action_verb_analysis: {
      points_analyzed: number;
      strong_verb_starts: number;
      feedback: string;
    };
    extraction_error?: string;
  };
}

export interface UploadState {
  isLoading: boolean;
  error: string | null;
  results: AnalysisResults | null;
}