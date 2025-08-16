import type { Transaction, PortfolioHistory, AssetAllocation, PortfolioSummary } from './types';

// The single source of truth for all portfolio data is now the transaction history.
// Asset values and holdings will be calculated from this list.
export const mockTransactions: Transaction[] = [
  // Apple Inc.
  { id: '1', date: '2023-01-15', assetName: 'Apple Inc.', assetType: 'Stock', type: 'Buy', quantity: 20, price: 150.25, totalAmount: 3005 },
  { id: '2', date: '2023-03-10', assetName: 'Apple Inc.', assetType: 'Stock', type: 'Buy', quantity: 30, price: 160.50, totalAmount: 4815 },
  
  // Alphabet Inc.
  { id: '3', date: '2023-02-01', assetName: 'Alphabet Inc.', assetType: 'Stock', type: 'Buy', quantity: 10, price: 2750.00, totalAmount: 27500 },
  { id: '4', date: '2023-04-05', assetName: 'Alphabet Inc.', assetType: 'Stock', type: 'Buy', quantity: 10, price: 2850.00, totalAmount: 28500 },
  
  // Microsoft Corp.
  { id: '5', date: '2023-01-20', assetName: 'Microsoft Corp.', assetType: 'Stock', type: 'Buy', quantity: 30, price: 300.50, totalAmount: 9015 },
  { id: '13', date: '2024-05-10', assetName: 'Microsoft Corp.', assetType: 'Stock', type: 'Sell', quantity: 10, price: 315.00, totalAmount: 3150 },

  // Amazon.com, Inc.
  { id: '6', date: '2023-03-01', assetName: 'Amazon.com, Inc.', assetType: 'Stock', type: 'Buy', quantity: 15, price: 130.00, totalAmount: 1950 },

  // Tesla, Inc.
  { id: '7', date: '2023-04-10', assetName: 'Tesla, Inc.', assetType: 'Stock', type: 'Buy', quantity: 25, price: 250.80, totalAmount: 6270 },

  // Mutual Funds
  { id: '8', date: '2023-01-05', assetName: 'Fidelity 500 Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 100, price: 145.00, totalAmount: 14500 },
  { id: '9', date: '2023-02-15', assetName: 'Vanguard Total Stock Market Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 150, price: 200.00, totalAmount: 30000 },
  { id: '10', date: '2023-03-20', assetName: 'Schwab S&P 500 Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 200, price: 75.00, totalAmount: 15000 },

  // Bonds
  { id: '11', date: '2022-05-15', assetName: 'US Treasury Bond', assetType: 'Bond', type: 'Buy', quantity: 10, price: 995, totalAmount: 9950 },
  { id: '12', date: '2021-02-09', assetName: 'Apple Inc. Bond', assetType: 'Bond', type: 'Buy', quantity: 5, price: 1050, totalAmount: 5250 },

  // Gold
  { id: '14', date: '2022-11-01', assetName: 'Digital Gold', assetType: 'Gold', type: 'Buy', quantity: 50, price: 65, totalAmount: 3250 },
  { id: '15', date: '2023-06-01', assetName: 'Gold Sovereign Bonds', assetType: 'Gold', type: 'Buy', quantity: 100, price: 60, totalAmount: 6000 },
  { id: '16', date: '2024-04-01', assetName: 'Digital Gold', assetType: 'Gold', type: 'Sell', quantity: 20, price: 75, totalAmount: 1500 },

];

// The following mock data is now deprecated and will be removed.
// The data will be calculated from the transactions list instead.

export const mockSummary: PortfolioSummary = {
  totalValue: 0,
  dayPl: 0,
  totalPl: 0,
};

export const mockStocks: any[] = [];
export const mockMutualFunds: any[] = [];
export const mockBonds: any[] = [];
export const mockGold: any[] = [];

export const mockPortfolioHistory: PortfolioHistory[] = [];
export const mockAssetAllocation: AssetAllocation[] = [];
