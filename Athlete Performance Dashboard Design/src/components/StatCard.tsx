import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function StatCard({ icon: Icon, label, value, trend, onClick }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#141414] border border-[#252525] rounded-xl p-6 ${onClick ? 'cursor-pointer hover:border-[#03fd1c] transition-all' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#03fd1c]/10 rounded-lg">
          <Icon className="w-6 h-6 text-[#03fd1c]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend.isPositive ? 'text-[#03fd1c]' : 'text-red-500'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );
}
