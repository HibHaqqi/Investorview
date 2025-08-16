import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, LandPlot, Banknote } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export async function DashboardCards() {
  const summary = await api.getCalculatedSummary();

  const totalPlPercent = (summary.totalInvested > 0) ? (summary.totalPl / summary.totalInvested) * 100 : 0;
  const dayPlPercent = (summary.totalValue - summary.dayPl) > 0 ? (summary.dayPl / (summary.totalValue - summary.dayPl)) * 100 : 0;

  const metrics = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(summary.totalValue),
      icon: Wallet,
      change: null,
      description: "Current value of all your holdings."
    },
    {
      title: "Day's P/L",
      value: formatCurrency(summary.dayPl),
      icon: DollarSign,
      change: {
        value: `${dayPlPercent.toFixed(2)}%`,
        isPositive: summary.dayPl >= 0,
      },
      description: "How your portfolio performed today."
    },
    {
      title: 'Total P/L',
      value: formatCurrency(summary.totalPl),
      icon: summary.totalPl >= 0 ? ArrowUpRight : ArrowDownRight,
      change: {
        value: `${totalPlPercent.toFixed(2)}%`,
        isPositive: summary.totalPl >= 0,
      },
      description: "Realized + Unrealized P/L."
    },
    {
      title: 'Total Deposits',
      value: formatCurrency(summary.totalDeposits),
      icon: LandPlot,
      change: null,
      description: "Total cash deposited into your account."
    },
    {
      title: 'Total Invested',
      value: formatCurrency(summary.totalInvested),
      icon: DollarSign,
      change: null,
      description: "Total amount spent on buying assets."
    },
    {
      title: 'Available Cash',
      value: formatCurrency(summary.availableCash),
      icon: Banknote,
      change: null,
      description: "Cash available for new investments."
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 text-muted-foreground ${metric.change?.isPositive ? 'text-green-600' : metric.change && !metric.change.isPositive ? 'text-red-600' : ''}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.change?.isPositive ? 'text-green-600' : metric.change && !metric.change.isPositive ? 'text-red-600' : ''}`}>{metric.value}</div>
            {metric.change ? (
              <p className={`text-xs ${metric.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <span className="flex items-center">
                  {metric.change.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {metric.change.value} from yesterday
                </span>
              </p>
            ) : (
                <p className="text-xs text-muted-foreground">
                    {metric.description}
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
            {[...Array(6)].map((_, i) => (
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
