// @ts-nocheck
import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function GrowthGraph({ data }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#888888' }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#FF1F8E" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
