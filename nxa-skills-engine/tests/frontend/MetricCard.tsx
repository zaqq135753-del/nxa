import React, { useState } from 'react';

export interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  changePercent: number;
  isPositive: boolean;
  onRefresh?: () => Promise<void>;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  changePercent,
  isPositive,
  onRefresh
}) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    try {
      setLoading(true);
      await onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      id={id}
      role="region"
      aria-label={title}
      className="p-5 rounded-xl bg-[#141719] border border-white/10 text-[#FFF4ED] shadow-sm hover:border-[#F6C945]/40 transition-colors"
    >
      <header className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            aria-label={'Atualizar ' + title}
            className="p-1 rounded hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#F6C945] focus:outline-none"
          >
            {loading ? "..." : "↻"}
          </button>
        )}
      </header>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        <span
          className={'text-xs font-semibold ' + (isPositive ? 'text-emerald-400' : 'text-rose-400')}
          aria-label={'Variacao: ' + (isPositive ? 'alta' : 'baixa') + ' de ' + changePercent + '%'}
        >
          {isPositive ? '+' : '-'}{Math.abs(changePercent)}%
        </span>
      </div>
    </article>
  );
};
