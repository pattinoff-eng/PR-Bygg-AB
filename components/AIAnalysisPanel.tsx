
import React from 'react';
import { AIAnalysis } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Props {
  analysis: AIAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

const AIAnalysisPanel: React.FC<Props> = ({ analysis, loading, onRefresh }) => {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          ByggKoll AI-Insikter
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyserar...' : 'Uppdatera Analys'}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="text-center py-8 text-indigo-600">
          <p>Klicka på knappen för att få en AI-driven analys av dina tidrapporter.</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-indigo-600 font-medium">Bygger analys med Gemini...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Sammanfattning
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{analysis.summary}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Effektivitetsanalys
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{analysis.efficiency}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Rekommendationer
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="bg-indigo-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
