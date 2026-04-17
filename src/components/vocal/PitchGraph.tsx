// @ts-nocheck
import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PitchGraph({ data }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="idx" hide />
          <YAxis domain={[100, 650]} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="hz" stroke="#FF1F8E" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
