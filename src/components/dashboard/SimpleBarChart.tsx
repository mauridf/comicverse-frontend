import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimpleBarChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  barColor?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  height = 300,
  barColor = '#1976d2' 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;