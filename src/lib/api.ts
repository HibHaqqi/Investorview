import { mockTransactions } from './data';
import type { Stock, MutualFund, Bond, Gold, Transaction, PortfolioSummary, PortfolioHistory, AssetAllocation, RealizedPL } from './types';

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

    transactions
        .filter(t => t.type === 'Buy' || t.type === 'Sell')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(t => {
        if (!t.assetName || !t.assetType) return;
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
            holdings[t.assetName].quantity += t.quantity!;
            holdings[t.assetName].totalInvested += t.totalAmount;
        } else { // Sell
            const holding = holdings[t.assetName];
            // Prorate the cost basis
            const proportionSold = holding.quantity > 0 ? t.quantity! / holding.quantity : 1;
            if (holding.quantity > 0) {
                 holding.totalInvested -= holding.totalInvested * proportionSold;
            }
            holding.quantity -= t.quantity!;
        }
        holdings[t.assetName].transactions.push(t);
    });

    return Object.values(holdings)
};

const calculateCostBasisFIFO = (sellTransaction: Transaction, allTransactions: Transaction[]): number => {
    const buyTransactions = allTransactions
        .filter(t => t.assetName === sellTransaction.assetName && t.type === 'Buy' && new Date(t.date) <= new Date(sellTransaction.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let costBasis = 0;
    let quantityToSell = sellTransaction.quantity!;
    
    // Create a mutable copy of buy transactions to track remaining quantities from previous sells
    const mutableBuys = buyTransactions.map(buy => ({ ...buy, remaining: buy.quantity! }));

    const sellTransactionsForAsset = allTransactions
      .filter(t => t.assetName === sellTransaction.assetName && t.type === 'Sell' && new Date(t.date) < new Date(sellTransaction.date))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for(const pastSell of sellTransactionsForAsset) {
      let soldQty = pastSell.quantity!;
      for (const buy of mutableBuys) {
        if (soldQty <= 0) break;
        const qtyToReduce = Math.min(buy.remaining, soldQty);
        buy.remaining -= qtyToReduce;
        soldQty -= qtyToReduce;
      }
    }


    for (const buy of mutableBuys) {
        if (quantityToSell <= 0) break;

        const qtyFromThisBuy = Math.min(buy.remaining, quantityToSell);
        costBasis += qtyFromThisBuy * buy.price!;
        buy.remaining -= qtyFromThisBuy;
        quantityToSell -= qtyFromThisBuy;
    }
    
    // Fallback for cases where buy history might be incomplete in mock data
    if (quantityToSell > 0 && quantityToSell < 1e-9) { // handle floating point inaccuracies
        quantityToSell = 0;
    }
    if (quantityToSell > 0) {
        const avgBuyPrice = buyTransactions.length > 0
            ? buyTransactions.reduce((acc, t) => acc + t.totalAmount, 0) / buyTransactions.reduce((acc, t) => acc + t.quantity!, 0)
            : sellTransaction.price!; // fallback to sell price if no buy history
        costBasis += quantityToSell * avgBuyPrice;
    }

    return costBasis;
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
      const holdings = processTransactions().filter(h => h.quantity > 1e-9);
      return holdings.filter(h => h.assetType === 'Stock').map(h => {
          const currentPrice = getCurrentPrice(h.assetName, 'Stock');
          return {
              id: h.assetName, // using name as ID
              ticker: h.assetName.substring(0,4).toUpperCase(),
              name: h.assetName,
              shares: h.quantity,
              avgPrice: h.quantity > 0 ? h.totalInvested / h.quantity : 0,
              currentPrice: currentPrice,
          }
      });
  },
  
  getCalculatedMutualFunds: async (): Promise<MutualFund[]> => {
      const holdings = processTransactions().filter(h => h.quantity > 1e-9);
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
      const holdings = processTransactions().filter(h => h.quantity > 1e-9);
      return holdings.filter(h => h.assetType === 'Bond').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              isin: `US${h.assetName.replace(/[^A-Z0-9]/g, '').slice(0,10)}`,
              quantity: h.quantity,
              purchasePrice: h.quantity > 0 ? h.totalInvested / h.quantity : 0,
              currentPrice: getCurrentPrice(h.assetName, 'Bond'),
              couponRate: ((h.assetName.length % 4) + 1) * 0.5,
              maturityDate: '2030-01-01'
          }
      });
  },

  getCalculatedGold: async (): Promise<Gold[]> => {
      const holdings = processTransactions().filter(h => h.quantity > 1e-9);
      return holdings.filter(h => h.assetType === 'Gold').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              grams: h.quantity,
              purchasePricePerGram: h.quantity > 0 ? h.totalInvested / h.quantity : 0,
              currentPricePerGram: getCurrentPrice(h.assetName, 'Gold'),
          }
      });
  },

  getRealizedPL: async (): Promise<RealizedPL[]> => {
    const allTransactions = await api.getTransactions();
    const sellTransactions = allTransactions.filter((t) => t.type === 'Sell');
    
    const realizedPLData: RealizedPL[] = sellTransactions.map(sell => {
      const costBasis = calculateCostBasisFIFO(sell, allTransactions);
      const saleValue = sell.totalAmount;
      const profitOrLoss = saleValue - costBasis;
  
      return {
          id: sell.id,
          saleDate: sell.date,
          assetName: sell.assetName!,
          assetType: sell.assetType!,
          quantitySold: sell.quantity!,
          salePrice: sell.price!,
          costBasis: costBasis,
          saleValue: saleValue,
          profitOrLoss: profitOrLoss,
      };
    });
  
    return realizedPLData.sort((a,b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  },

  getCalculatedSummary: async(): Promise<PortfolioSummary> => {
    const holdings = processTransactions().filter(h => h.quantity > 1e-9);
    let totalValue = 0;
    let totalInvestedInHoldings = 0;
    let dayPl = 0;

    holdings.forEach(h => {
        const currentPrice = getCurrentPrice(h.assetName, h.assetType);
        const currentValue = h.quantity * currentPrice;
        totalValue += currentValue;
        totalInvestedInHoldings += h.totalInvested;
        dayPl += h.quantity * getDayChange(currentPrice);
    });

    const unrealizedPl = totalValue - totalInvestedInHoldings;

    const realizedPLData = await api.getRealizedPL();
    const totalRealizedPl = realizedPLData.reduce((acc, item) => acc + item.profitOrLoss, 0);

    const totalDeposits = transactions.filter(t => t.type === 'Deposit').reduce((acc, t) => acc + t.totalAmount, 0);
    const totalWithdrawalsFromSell = transactions.filter(t => t.type === 'Sell').reduce((acc, t) => acc + t.totalAmount, 0);
    const totalWithdrawalsFromCash = transactions.filter(t => t.type === 'Withdrawal').reduce((acc, t) => acc + t.totalAmount, 0);
    const totalBuys = transactions.filter(t => t.type === 'Buy').reduce((acc, t) => acc + t.totalAmount, 0);

    const availableCash = totalDeposits + totalWithdrawalsFromSell - totalBuys - totalWithdrawalsFromCash;

    return {
        totalValue,
        dayPl,
        totalPl: unrealizedPl + totalRealizedPl,
        totalDeposits,
        totalInvested: totalBuys,
        availableCash,
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
    const holdings = processTransactions().filter(h => h.quantity > 1e-9);
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
