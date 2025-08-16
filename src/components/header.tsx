'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/stocks': 'Stocks Portfolio',
  '/mutual-funds': 'Mutual Funds',
  '/bonds': 'Bonds Holdings',
  '/gold': 'Gold Investments',
  '/transactions': 'Transaction Journal',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // In a real app, you would re-fetch data here.
    // For this mock, we'll just simulate a delay and then refresh the page.
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.refresh();
    toast({
      title: 'Data Refreshed',
      description: 'Your portfolio data has been updated.',
    });
    setIsRefreshing(false);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold md:text-2xl">
        {pageTitles[pathname] || 'InvestorView'}
      </h1>
      <div className="ml-auto">
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh Data</span>
        </Button>
      </div>
    </header>
  );
}
