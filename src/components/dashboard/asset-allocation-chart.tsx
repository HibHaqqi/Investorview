'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts';
import useSWR from 'swr';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import api from '@/lib/api';
import { Skeleton } from '../ui/skeleton';

const fetcher = () => api.getAssetAllocation();

export function AssetAllocationChart() {
  const { data: chartData, isLoading } = useSWR('assetAllocation', fetcher);

  const chartConfig = React.useMemo(() => {
    if (!chartData) return {};
    return chartData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {});
  }, [chartData]);
  
  if (isLoading) return <AssetAllocationChartSkeleton />;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="name" />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
            {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{paddingTop: 20}}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function AssetAllocationChartSkeleton() {
  return (
    <div className="mx-auto flex h-[250px] items-center justify-center">
        <Skeleton className="aspect-square h-[200px] rounded-full" />
    </div>
  )
}
