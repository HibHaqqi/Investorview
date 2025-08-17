export type Stock = {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
};

export type MutualFund = {
  id: string;
  name: string;
  units: number;
  nav: number;
  investedValue: number;
};

export type Bond = {
  id: string;
  name: string;
  isin: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  couponRate: number;
  maturityDate: string;
};

export type Gold = {
  id:string;
  name: string;
  grams: number;
  purchasePricePerGram: number;
  currentPricePerGram: number;
};

export type Transaction = {
  id: string;
  date: string;
  assetName?: string; // Optional for Deposits/Withdrawals
  assetType?: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold'; // Optional for Deposits/Withdrawals
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdrawal';
  quantity?: number; // Optional for Deposits/Withdrawals
  price?: number; // Optional for Deposits/Withdrawals
  totalAmount: number;
};

export type PortfolioSummary = {
  totalValue: number;
  dayPl: number;
  totalPl: number;
  totalDeposits: number;
  totalInvested: number;
  availableCash: number;
};

export type AssetAllocation = {
  name: string;
  value: number;
  fill: string;
};

export type PortfolioHistory = {
  date: string;
  value: number;
};

export type UnrealizedPL = {
  assetName: string;
  assetType: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold';
  investedValue: number;
  currentValue: number;
};

export type RealizedPL = {
    id: string;
    saleDate: string;
    assetName: string;
    assetType: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold';
    quantitySold: number;
    salePrice: number;
    costBasis: number;
    saleValue: number;
    profitOrLoss: number;
};
