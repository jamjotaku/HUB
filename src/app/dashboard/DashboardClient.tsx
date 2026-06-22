'use client';
import { CosplayData } from '@/lib/data';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardClient({ data }: { data: CosplayData[] }) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.member] = (counts[item.member] || 0) + 1;
    });
    
    // 件数で降順ソート
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.8rem' }}>VTuber別 コスプレ件数ランキング</h2>
      <div style={{ height: '600px', width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
            <XAxis type="number" stroke="#a1a1aa" />
            <YAxis dataKey="name" type="category" stroke="#f4f4f5" width={120} tick={{ fontSize: 14 }} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: 'rgba(28,28,36,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
              itemStyle={{ color: '#e0aaff' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#e0aaff' : '#9d4edd'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
