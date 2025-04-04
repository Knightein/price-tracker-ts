import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import alertRouter from '../routes/alertRoutes';

// mock product service so it returns expected data
jest.mock('../services/productService', () => ({
    getProductData: (productUrl: string) => {
        if (productUrl === 'https://example.com/product/1') {
            return { currentPrice: 100 };
        }
        return null;
    },
}));

const app = express();
app.use(bodyParser.json());
app.use('/alerts', alertRouter);

describe('Alert API', () => {
    it('should contain the product.json file', () => {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../data/products.json');
        expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should return 400 if productUrl is not found', async () => {
        const res = await request(app).post('/alerts').send({
            productUrl: 'https://example.com/product/568906480',
            desiredPrice: 50,
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Product not found.');
    });

    it('should return 500 if the desiredPrice is not a number.', async () => {
        const res = await request(app).post('/alerts').send({
            productUrl: 'https://example.com/product/1',
            desiredPrice: 'not-a-number',
        });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Desired price must be a number.');
    })

    it('should return 500 if JSON is malformed.', async () => {
        const res = await request(app).post('/alerts').send('malformed json');
        expect(res.status).toBe(500);
        expect(res.body.error).toBe(undefined);
    })

    it('should return 404 if productUrl or desiredPrice is missing.', async () => {
        const res = await request(app).post('/alerts').send({
            productUrl: 'https://example.com/product/1',
        })
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Product URL not found or desired price not provided.');
    });

    it('should set alert and send notification if condition is met', async () => {
        // product /1 has a price of 100
        const res = await request(app).post('/alerts').send({
            productUrl: 'https://example.com/product/1',
            desiredPrice: 120,
        })
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Alert created and condition met, sending notification.');
    })

    it('should set an alert if the desiredPrice is exactly the same as the current price', async () => {
        const res = await request(app).post('/alerts').send({
            productUrl: 'https://example.com/product/1',
            desiredPrice: 100,
        })
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Alert created and condition met, sending notification.');
    })

    it('should set alert without notification when desiredPrice is below current price.', async () => {
        const res = await request(app).post('/alerts').send({
            productUrl: 'https://example.com/product/1',
            desiredPrice: 90,
            frequency: '24h',
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Alert has been set. We will notify you when the price condition is met.');
    });
})
