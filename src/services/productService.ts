import {readFileSync} from 'fs';
import {join} from 'path';
import ProductData from "../types/productData";
import logger from "../util/logger";

const productsDataPath = join(__dirname, '../data/products.json');

export const getProductData = (productUrl: string): ProductData | null => {
    try {
        const data = readFileSync(productsDataPath, 'utf-8');
        const products = JSON.parse(data);
        return products[productUrl] || null;
    }
    catch (error) {
        logger.error('Error reading product data:', error);
        return null;
    }
}
