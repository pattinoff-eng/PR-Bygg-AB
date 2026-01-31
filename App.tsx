
import React, { useState, useEffect, useCallback } from 'react';
import { TimeEntry, AIAnalysis } from './types';
import { PROJECTS } from './constants';
import { analyzeTimeReports } from './services/geminiService';
import TimeEntryForm from './components/TimeEntryForm';
import Dashboard from './components/Dashboard';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import { LayoutDashboard, FileText, Settings, LogOut, Search, Trash2, Printer } from 'lucide-react';

const App: React.FC = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      date: '2023-10-24',
      projectId: '1',
      hours: 8,
      workType: 'Normaltid' as any,
      description: 'Montering av köksinredning i lägenhet 12-14.',
      workerName: 'Karl Byggare'
    },
    {
      id: '2',
      date: '2023-10-24',
      projectId: '2',
      hours: 4,
      workType: 'Normaltid' as any,
      description: 'Markarbete och förberedelse för gjutning.',
      workerName: 'Sara Snickare'
    },
    {
      id: '3',
      date: '2023-10-25',
      projectId: '1',
      hours: 2,
      workType: 'ÄTA-arbete' as any,
      description: 'Extra rördragning efter ändringsbeslut kunden.',
      workerName: 'Karl Byggare'
    }
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'entry' | 'reports' | 'dashboard'>('entry');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddEntry = (newEntry: Omit<TimeEntry, 'id'>) => {
    const entry: TimeEntry = {
      ...newEntry,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEntries(prev => [entry, ...prev]);
    // Potentially trigger AI update if needed, but let's keep it manual
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeTimeReports(entries, PROJECTS);
      if (result) setAiAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    PROJECTS.find(p => p.id === e.projectId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen flex flex-col sticky top-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="bg-amber-500 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold tracking-tight">ByggKoll</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('entry')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'entry' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800'}`}
            >
              <FileText className="w-5 h-5" /> Tidrapportering
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800'}`}
            >
              <Search className="w-5 h-5" /> Rapporter & Logg
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-2 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" /> Inställningar
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-red-400">
            <LogOut className="w-5 h-5" /> Logga ut
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Välkommen tillbaka, Admin</h1>
            <p className="text-slate-500 font-medium">Översikt för samtliga pågående projekt.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition shadow-sm">
              <Printer className="w-4 h-4" /> Exportera PDF
            </button>
          </div>
        </header>

        {activeTab === 'entry' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <TimeEntryForm onSubmit={handleAddEntry} />
            </div>
            <div className="xl:col-span-2 space-y-8">
              <AIAnalysisPanel analysis={aiAnalysis} loading={isAnalyzing} onRefresh={handleRunAnalysis} />
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Senaste tidrapporter</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Sök rapporter..." 
                      className="pl-10 pr-4 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <th className="px-6 py-3">Datum</th>
                        <th className="px-6 py-3">Namn</th>
                        <th className="px-6 py-3">Projekt</th>
                        <th className="px-6 py-3">Typ</th>
                        <th className="px-6 py-3">Timmar</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEntries.map(entry => {
                        const project = PROJECTS.find(p => p.id === entry.projectId);
                        return (
                          <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{entry.date}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{entry.workerName}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="font-semibold text-slate-800">{project?.name}</span>
                              <p className="text-xs text-slate-400">{project?.code}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                                entry.workType === 'Normaltid' ? 'bg-green-100 text-green-700' :
                                entry.workType === 'ÄTA-arbete' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {entry.workType}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">{entry.hours} h</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredEntries.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                            Inga rapporter matchar sökningen.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard entries={entries} />
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Projektarkiv & Logg</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Här kan du se historiska rapporter, filtrera på specifika projektgrupper och generera löneunderlag.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROJECTS.map(p => (
                <div key={p.id} className="p-4 border rounded-xl hover:border-amber-500 transition cursor-pointer text-left">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{p.code}</span>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Aktivt</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{p.location}</p>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>Totalt: {entries.filter(e => e.projectId === p.id).reduce((a, b) => a + b.hours, 0)} h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
