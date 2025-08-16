import type { Stock, MutualFund, Bond, Gold, Transaction, PortfolioSummary, PortfolioHistory, AssetAllocation } from './types';

export const mockSummary: PortfolioSummary = {
  totalValue: 153450.75,
  dayPl: 1250.30,
  totalPl: 28450.75,
};

export const mockStocks: Stock[] = [
  { id: '1', ticker: 'AAPL', name: 'Apple Inc.', shares: 50, avgPrice: 150.25, currentPrice: 175.50 },
  { id: '2', ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 20, avgPrice: 2800.00, currentPrice: 2850.75 },
  { id: '3', ticker: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgPrice: 300.50, currentPrice: 310.00 },
  { id: '4', ticker: 'AMZN', name: 'Amazon.com, Inc.', shares: 15, avgPrice: 130.00, currentPrice: 135.20 },
  { id: '5', ticker: 'TSLA', name: 'Tesla, Inc.', shares: 25, avgPrice: 250.80, currentPrice: 260.10 },
];

export const mockMutualFunds: MutualFund[] = [
  { id: '1', name: 'Fidelity 500 Index Fund', units: 100, nav: 150.75, investedValue: 14500 },
  { id: '2', name: 'Vanguard Total Stock Market Index Fund', units: 150, nav: 210.50, investedValue: 30000 },
  { id: '3', name: 'Schwab S&P 500 Index Fund', units: 200, nav: 80.20, investedValue: 15000 },
];

export const mockBonds: Bond[] = [
  { id: '1', name: 'US Treasury Bond', isin: 'US912828U876', quantity: 10, purchasePrice: 995, currentPrice: 1010, couponRate: 2.5, maturityDate: '2033-05-15' },
  { id: '2', name: 'Apple Inc. Bond', isin: 'US037833BY72', quantity: 5, purchasePrice: 1050, currentPrice: 1075, couponRate: 3.2, maturityDate: '2028-02-09' },
];

export const mockGold: Gold[] = [
  { id: '1', name: 'Digital Gold', grams: 50, purchasePricePerGram: 65, currentPricePerGram: 72 },
  { id: '2', name: 'Gold Sovereign Bonds', grams: 100, purchasePricePerGram: 60, currentPricePerGram: 72 },
];

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2023-05-20', assetName: 'Apple Inc.', assetType: 'Stock', type: 'Buy', quantity: 10, price: 172.5, totalAmount: 1725 },
  { id: '2', date: '2023-05-22', assetName: 'Fidelity 500 Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 20, price: 148.2, totalAmount: 2964 },
  { id: '3', date: '2023-06-01', assetName: 'Microsoft Corp.', assetType: 'Stock', type: 'Sell', quantity: 5, price: 330.1, totalAmount: 1650.5 },
  { id: '4', date: '2023-06-15', assetName: 'Digital Gold', assetType: 'Gold', type: 'Buy', quantity: 10, price: 68, totalAmount: 680 },
];

export const mockPortfolioHistory: PortfolioHistory[] = [
  { date: 'Jan', value: 125000 },
  { date: 'Feb', value: 128000 },
  { date: 'Mar', value: 135000 },
  { date: 'Apr', value: 132000 },
  { date: 'May', value: 140000 },
  { date: 'Jun', value: 145000 },
  { date: 'Jul', value: 153450 },
];

export const mockAssetAllocation: AssetAllocation[] = [
    { name: 'Stocks', value: 75000, fill: 'var(--color-chart-1)' },
    { name: 'Mutual Funds', value: 45000, fill: 'var(--color-chart-2)' },
    { name: 'Bonds', value: 20000, fill: 'var(--color-chart-3)' },
    { name: 'Gold', value: 13450, fill: 'var(--color-chart-4)' },
];
