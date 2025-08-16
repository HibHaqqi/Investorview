'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import api from '@/lib/api';
import { Skeleton } from '../ui/skeleton';
import { CardContent } from '../ui/card';

const fetcher = () => api.getPortfolioHistory();

export function PortfolioHistoryChart() {
  const { data: chartData, isLoading } = useSWR('portfolioHistory', fetcher);

  const chartConfig = {
    value: {
      label: 'Value',
      color: 'hsl(var(--accent))',
    },
  };

  if (isLoading) return <PortfolioHistoryChartSkeleton />;

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${value / 1000}k`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="value"
          type="natural"
          fill="var(--color-value)"
          fillOpacity={0.4}
          stroke="var(--color-value)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function PortfolioHistoryChartSkeleton() {
    return (
        <div className="h-[250px] w-full p-4">
            <Skeleton className="h-full w-full" />
        </div>
    )
}
