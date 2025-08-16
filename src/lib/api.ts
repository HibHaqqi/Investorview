import { mockTransactions } from './data';
import type { Stock, MutualFund, Bond, Gold, Transaction, PortfolioSummary, PortfolioHistory, AssetAllocation } from './types';

// In-memory data store, seeded with initial mock data
let transactions: Transaction[] = [...mockTransactions];

// Helper to get current price (mocked)
const getCurrentPrice = (assetName: string, assetType: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold') => {
    // In a real app, this would fetch from a live API
    // For now, we'll use a simple deterministic mock based on the asset name length
    const basePrice = (assetName.length * 15) % 300 + 50;
    const priceJitter = (new Date().getDate() % 10) - 5; // pseudo-random daily fluctuation
    switch (assetType) {
        case 'Stock': return basePrice + priceJitter + 10;
        case 'Mutual Fund': return basePrice * 1.2 + priceJitter;
        case 'Bond': return 1000 + (assetName.length * 2) + priceJitter;
        case 'Gold': return 70 + priceJitter / 2;
        default: return basePrice;
    }
}

const getDayChange = (currentPrice: number) => {
    // Simple mock for daily change
    return (currentPrice * (Math.sin(new Date().getDate()) * 0.02));
};

const processTransactions = () => {
    const holdings: { [key: string]: {
        assetName: string;
        assetType: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold';
        quantity: number;
        totalInvested: number;
        transactions: Transaction[];
    }} = {};

    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(t => {
        if (!holdings[t.assetName]) {
            holdings[t.assetName] = {
                assetName: t.assetName,
                assetType: t.assetType,
                quantity: 0,
                totalInvested: 0,
                transactions: []
            };
        }

        if (t.type === 'Buy') {
            holdings[t.assetName].quantity += t.quantity;
            holdings[t.assetName].totalInvested += t.totalAmount;
        } else { // Sell
            const holding = holdings[t.assetName];
            const proportion = t.quantity / holding.quantity;
            if (holding.quantity > 0) {
                 holding.totalInvested -= holding.totalInvested * proportion;
            }
            holding.quantity -= t.quantity;
        }
        holdings[t.assetName].transactions.push(t);
    });

    return Object.values(holdings).filter(h => h.quantity > 0.0001); // Filter out sold-off assets
};

const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // shorter delay
    return [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction = { ...transaction, id: String(transactions.length + 1) };
    transactions.unshift(newTransaction);
    return newTransaction;
  },

  getCalculatedStocks: async (): Promise<Stock[]> => {
      const holdings = processTransactions();
      return holdings.filter(h => h.assetType === 'Stock').map(h => {
          const currentPrice = getCurrentPrice(h.assetName, 'Stock');
          return {
              id: h.assetName, // using name as ID
              ticker: h.assetName.substring(0,4).toUpperCase(),
              name: h.assetName,
              shares: h.quantity,
              avgPrice: h.totalInvested / h.quantity,
              currentPrice: currentPrice,
          }
      });
  },
  
  getCalculatedMutualFunds: async (): Promise<MutualFund[]> => {
      const holdings = processTransactions();
      return holdings.filter(h => h.assetType === 'Mutual Fund').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              units: h.quantity,
              nav: getCurrentPrice(h.assetName, 'Mutual Fund'),
              investedValue: h.totalInvested
          }
      });
  },

  getCalculatedBonds: async (): Promise<Bond[]> => {
      const holdings = processTransactions();
      return holdings.filter(h => h.assetType === 'Bond').map(h => {
          const lastBuy = h.transactions.filter(t => t.type === 'Buy').pop();
          return {
              id: h.assetName,
              name: h.assetName,
              isin: `US${h.assetName.replace(/[^A-Z0-9]/g, '').slice(0,10)}`,
              quantity: h.quantity,
              purchasePrice: h.totalInvested / h.quantity,
              currentPrice: getCurrentPrice(h.assetName, 'Bond'),
              couponRate: ((h.assetName.length % 4) + 1) * 0.5,
              maturityDate: '2030-01-01'
          }
      });
  },

  getCalculatedGold: async (): Promise<Gold[]> => {
      const holdings = processTransactions();
      return holdings.filter(h => h.assetType === 'Gold').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              grams: h.quantity,
              purchasePricePerGram: h.totalInvested / h.quantity,
              currentPricePerGram: getCurrentPrice(h.assetName, 'Gold'),
          }
      });
  },

  getCalculatedSummary: async(): Promise<PortfolioSummary> => {
    const holdings = processTransactions();
    let totalValue = 0;
    let totalInvested = 0;
    let dayPl = 0;

    holdings.forEach(h => {
        const currentPrice = getCurrentPrice(h.assetName, h.assetType);
        const currentValue = h.quantity * currentPrice;
        totalValue += currentValue;
        totalInvested += h.totalInvested;
        dayPl += h.quantity * getDayChange(currentPrice);
    });

    return {
        totalValue,
        dayPl,
        totalPl: totalValue - totalInvested,
    };
  },

  getPortfolioHistory: async (): Promise<PortfolioHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const summary = await api.getCalculatedSummary();
    // This is a simplified mock. A real implementation would process transactions over time.
    return [
      { date: 'Jan', value: summary.totalValue * 0.8 },
      { date: 'Feb', value: summary.totalValue * 0.82 },
      { date: 'Mar', value: summary.totalValue * 0.88 },
      { date: 'Apr', value: summary.totalValue * 0.85 },
      { date: 'May', value: summary.totalValue * 0.92 },
      { date: 'Jun', value: summary.totalValue * 0.95 },
      { date: 'Jul', value: summary.totalValue },
    ];
  },

  getAssetAllocation: async (): Promise<AssetAllocation[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const holdings = processTransactions();
    const allocation : Record<string, number> = {
        'Stocks': 0,
        'Mutual Funds': 0,
        'Bonds': 0,
        'Gold': 0
    };

    holdings.forEach(h => {
        const currentValue = h.quantity * getCurrentPrice(h.assetName, h.assetType);
        const assetTypeName = h.assetType === 'Mutual Fund' ? 'Mutual Funds' : `${h.assetType}s`;
        if(allocation[assetTypeName] !== undefined) {
             allocation[assetTypeName] += currentValue;
        }
    });

    return [
        { name: 'Stocks', value: allocation['Stocks'], fill: 'var(--color-chart-1)' },
        { name: 'Mutual Funds', value: allocation['Mutual Funds'], fill: 'var(--color-chart-2)' },
        { name: 'Bonds', value: allocation['Bonds'], fill: 'var(--color-chart-3)' },
        { name: 'Gold', value: allocation['Gold'], fill: 'var(--color-chart-4)' },
    ].filter(a => a.value > 0);
  },
};

export default api;
