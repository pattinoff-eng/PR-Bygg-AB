
import React, { useState } from 'react';
import { PROJECTS, WORK_TYPES } from '../constants';
import { WorkType, TimeEntry } from '../types';
import { Calendar, Clock, ClipboardList, HardHat } from 'lucide-react';

interface Props {
  onSubmit: (entry: Omit<TimeEntry, 'id'>) => void;
}

const TimeEntryForm: React.FC<Props> = ({ onSubmit }) => {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('8');
  const [workType, setWorkType] = useState<WorkType>(WorkType.NORMAL);
  const [description, setDescription] = useState('');
  const [workerName, setWorkerName] = useState('Karl Byggare');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      date,
      hours: parseFloat(hours),
      workType,
      description,
      workerName
    });
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <HardHat className="w-5 h-5 text-amber-500" />
        Ny Tidrapport
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Anställd</label>
          <input
            type="text"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Namn..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timmar
            </label>
            <input
              type="number"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Projekt</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          >
            {PROJECTS.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Typ av arbete</label>
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value as WorkType)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          >
            {WORK_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Beskrivning
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none h-24"
            placeholder="Vad har utförts idag? T.ex. Gjutning av platta, väggregling..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          Rapportera Tid
        </button>
      </div>
    </form>
  );
};

export default TimeEntryForm;
