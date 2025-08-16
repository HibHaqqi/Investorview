import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export async function DashboardCards() {
  const summary = await api.getSummary();

  const metrics = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(summary.totalValue),
      icon: Wallet,
      change: null,
    },
    {
      title: "Day's P/L",
      value: formatCurrency(summary.dayPl),
      icon: DollarSign,
      change: {
        value: ((summary.dayPl / (summary.totalValue - summary.dayPl)) * 100).toFixed(2) + '%',
        isPositive: summary.dayPl >= 0,
      },
    },
    {
      title: 'Total P/L',
      value: formatCurrency(summary.totalPl),
      icon: DollarSign,
      change: {
        value: ((summary.totalPl / (summary.totalValue - summary.totalPl)) * 100).toFixed(2) + '%',
        isPositive: summary.totalPl >= 0,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.change && (
              <p className={`text-xs ${metric.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <span className="flex items-center">
                  {metric.change.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {metric.change.value}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-40 mb-2" />
                        <Skeleton className="h-4 w-20" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
