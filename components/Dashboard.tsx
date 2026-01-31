
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TimeEntry, Project, WorkType } from '../types';
import { PROJECTS } from '../constants';

interface Props {
  entries: TimeEntry[];
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<Props> = ({ entries }) => {
  const projectStats = useMemo(() => {
    const stats: Record<string, number> = {};
    entries.forEach(e => {
      const projectName = PROJECTS.find(p => p.id === e.projectId)?.name || 'Okänt';
      stats[projectName] = (stats[projectName] || 0) + e.hours;
    });
    return Object.entries(stats).map(([name, hours]) => ({ name, hours }));
  }, [entries]);

  const typeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    entries.forEach(e => {
      stats[e.workType] = (stats[e.workType] || 0) + e.hours;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const totalHours = entries.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Totalt rapporterade timmar</p>
          <p className="text-3xl font-bold text-slate-900">{totalHours} h</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Antal rapporter</p>
          <p className="text-3xl font-bold text-slate-900">{entries.length} st</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Genomsnittlig passlängd</p>
          <p className="text-3xl font-bold text-slate-900">{(totalHours / (entries.length || 1)).toFixed(1)} h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Timmar per projekt</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="hours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Fördelning arbetstyp</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
