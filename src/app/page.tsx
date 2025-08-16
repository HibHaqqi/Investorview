import { Suspense } from 'react';
import { DashboardCards, DashboardCardsSkeleton } from '@/components/dashboard/cards';
import { AssetAllocationChart, AssetAllocationChartSkeleton } from '@/components/dashboard/asset-allocation-chart';
import { PortfolioHistoryChart, PortfolioHistoryChartSkeleton } from '@/components/dashboard/portfolio-history-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCards />
      </Suspense>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio History</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PortfolioHistoryChartSkeleton />}>
                <PortfolioHistoryChart />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<AssetAllocationChartSkeleton />}>
                <AssetAllocationChart />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}