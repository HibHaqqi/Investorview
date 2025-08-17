import { mockTransactions } from './data';
import type { Stock, MutualFund, Bond, Gold, Transaction, PortfolioSummary, PortfolioHistory, AssetAllocation, RealizedPL } from './types';
import yahooFinance from 'yahoo-finance2';

// In-memory data store, seeded with initial mock data
let transactions: Transaction[] = [...mockTransactions];

// --- Caching mechanism to avoid hitting the API too often ---
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// --- Ticker Mapping ---
// In a real app, you might want a more robust way to manage this,
// maybe even storing tickers directly in the transaction data.
const assetToTickerMap: { [key: string]: string } = {
    'Apple Inc.': 'AAPL',
    'Alphabet Inc.': 'GOOGL',
    'Microsoft Corp.': 'MSFT',
    'Amazon.com, Inc.': 'AMZN',
    'Tesla, Inc.': 'TSLA',
    'Fidelity 500 Index Fund': 'FXAIX',
    'Vanguard Total Stock Market Index Fund': 'VTSAX',
    'Schwab S&P 500 Index Fund': 'SWPPX',
    'Digital Gold': 'GC=F', // Gold futures ticker
    'Gold Sovereign Bonds': 'GC=F',
    // Bonds are tricky as they don't have simple tickers. We'll continue to mock them.
};


const getLivePrice = async (assetName: string, assetType: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold'): Promise<number> => {
    const ticker = assetToTickerMap[assetName];

    // Bonds are not on Yahoo Finance in a simple way, so we keep their mock.
    if (assetType === 'Bond' || !ticker) {
        const basePrice = (assetName.length * 15) % 300 + 50;
        return 1000 + (assetName.length * 2);
    }
    
    // Check cache first
    const cached = priceCache.get(ticker);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
        return cached.price;
    }

    try {
        const result = await yahooFinance.quote(ticker);
        const price = result?.regularMarketPrice;
        if (price) {
            priceCache.set(ticker, { price, timestamp: Date.now() });
            return price;
        }
    } catch (error) {
        console.error(`Could not fetch price for ${ticker}:`, error);
    }

    // Fallback to mock price if API fails or for unmapped assets
    const basePrice = (assetName.length * 15) % 300 + 50;
    const priceJitter = (new Date().getDate() % 10) - 5; 
    switch (assetType) {
        case 'Stock': return basePrice + priceJitter + 10;
        case 'Mutual Fund': return basePrice * 1.2 + priceJitter;
        case 'Gold': return 70 + priceJitter / 2;
        default: return basePrice;
    }
};


const getDayChange = (quote?: { regularMarketChange?: number }) => {
    return quote?.regularMarketChange ?? 0;
};

const processTransactions = async () => {
    const holdings: { [key: string]: {
        assetName: string;
        assetType: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold';
        quantity: number;
        totalInvested: number;
        transactions: Transaction[];
        currentPrice?: number;
        dayChange?: number;
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
            const proportionSold = holding.quantity > 0 ? t.quantity! / holding.quantity : 1;
            if (holding.quantity > 0) {
                 holding.totalInvested -= holding.totalInvested * proportionSold;
            }
            holding.quantity -= t.quantity!;
        }
        holdings[t.assetName].transactions.push(t);
    });
    
    const validHoldings = Object.values(holdings).filter(h => h.quantity > 1e-9);

    // Batch fetch prices for all valid holdings
    const tickersToFetch = validHoldings
        .map(h => assetToTickerMap[h.assetName])
        .filter((ticker): ticker is string => !!ticker)
        .filter(ticker => { // filter out cached tickers
            const cached = priceCache.get(ticker);
            return !(cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS));
        });
    
    if (tickersToFetch.length > 0) {
        try {
            const results = await yahooFinance.quote(tickersToFetch);
            const quotes = Array.isArray(results) ? results : [results];
            for (const quote of quotes) {
                if (quote.symbol && quote.regularMarketPrice) {
                    priceCache.set(quote.symbol, { price: quote.regularMarketPrice, timestamp: Date.now() });
                }
            }
        } catch (error) {
            console.error("Batch price fetch failed:", error);
        }
    }
    
    // Populate prices into holdings
    for (const holding of validHoldings) {
        holding.currentPrice = await getLivePrice(holding.assetName, holding.assetType);
        // Note: Day's change would ideally come from the same batch call,
        // but yahoo-finance2's quote response structure varies.
        // For simplicity, we'll keep it mocked for now.
        holding.dayChange = getDayChange(); 
    }


    return validHoldings;
};

const calculateCostBasisFIFO = (sellTransaction: Transaction, allTransactions: Transaction[]): number => {
    const buyTransactions = allTransactions
        .filter(t => t.assetName === sellTransaction.assetName && t.type === 'Buy' && new Date(t.date) <= new Date(sellTransaction.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let costBasis = 0;
    let quantityToSell = sellTransaction.quantity!;
    
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
    
    if (quantityToSell > 0 && quantityToSell < 1e-9) { 
        quantityToSell = 0;
    }
    if (quantityToSell > 0) {
        const avgBuyPrice = buyTransactions.length > 0
            ? buyTransactions.reduce((acc, t) => acc + t.totalAmount, 0) / buyTransactions.reduce((acc, t) => acc + t.quantity!, 0)
            : sellTransaction.price!; 
        costBasis += quantityToSell * avgBuyPrice;
    }

    return costBasis;
};


const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); 
    return [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction = { ...transaction, id: String(transactions.length + 1) };
    transactions.unshift(newTransaction);
    return newTransaction;
  },

  getCalculatedStocks: async (): Promise<Stock[]> => {
      const holdings = await processTransactions();
      return holdings.filter(h => h.assetType === 'Stock').map(h => {
          return {
              id: h.assetName, // using name as ID
              ticker: assetToTickerMap[h.assetName] || h.assetName.substring(0,4).toUpperCase(),
              name: h.assetName,
              shares: h.quantity,
              avgPrice: h.quantity > 0 ? h.totalInvested / h.quantity : 0,
              currentPrice: h.currentPrice!,
          }
      });
  },
  
  getCalculatedMutualFunds: async (): Promise<MutualFund[]> => {
       const holdings = await processTransactions();
      return holdings.filter(h => h.assetType === 'Mutual Fund').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              units: h.quantity,
              nav: h.currentPrice!,
              investedValue: h.totalInvested
          }
      });
  },

  getCalculatedBonds: async (): Promise<Bond[]> => {
      const holdings = await processTransactions();
      return holdings.filter(h => h.assetType === 'Bond').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              isin: `US${h.assetName.replace(/[^A-Z0-9]/g, '').slice(0,10)}`,
              quantity: h.quantity,
              purchasePrice: h.quantity > 0 ? h.totalInvested / h.quantity : 0,
              currentPrice: h.currentPrice!,
              couponRate: ((h.assetName.length % 4) + 1) * 0.5,
              maturityDate: '2030-01-01'
          }
      });
  },

  getCalculatedGold: async (): Promise<Gold[]> => {
      const holdings = await processTransactions();
      return holdings.filter(h => h.assetType === 'Gold').map(h => {
          return {
              id: h.assetName,
              name: h.assetName,
              grams: h.quantity,
              purchasePricePerGram: h.quantity > 0 ? h.totalInvested / h.quantity : 0,
              currentPricePerGram: h.currentPrice!,
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
    const holdings = await processTransactions();
    let totalValue = 0;
    let totalInvestedInHoldings = 0;
    let dayPl = 0;

    holdings.forEach(h => {
        const currentValue = h.quantity * h.currentPrice!;
        totalValue += currentValue;
        totalInvestedInHoldings += h.totalInvested;
        // Day's P/L calculation needs to be updated to use live data
        // For now, we'll use a simplified mock based on the price change if available
        dayPl += h.quantity * (h.dayChange || 0);
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
    const holdings = await processTransactions();
    const allocation : Record<string, number> = {
        'Stocks': 0,
        'Mutual Funds': 0,
        'Bonds': 0,
        'Gold': 0
    };

    holdings.forEach(h => {
        const currentValue = h.quantity * h.currentPrice!;
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
