export interface Alert {
    productUrl: string;
    desiredPrice: number;
    frequency?: string; // how frequently to check the price (24h, 3d, 7d, etc)
}