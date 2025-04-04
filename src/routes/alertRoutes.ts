import {Router, Request, Response} from "express";
import {Alert} from "../models/Alert";
import {getProductData} from "../services/productService";
import {sendNotification} from "../services/notificationService";
import logger from "../util/logger";

const router = Router();
const alerts: Alert[] = []; // in-memory storage for alerts, replace with a database in production

const checkPriceCondition = (alert: Alert) => {
    const product = getProductData(alert.productUrl);
    if (product && product.currentPrice <= alert.desiredPrice) {
        sendNotification(alert.productUrl, product.currentPrice);
        return true; // alert condition met
    }
    return false;
};

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { productUrl, desiredPrice, frequency } = req.body as Alert;

    // check if product exists in the products.json data
    const product = getProductData(productUrl);
    if (!product) {
        res.status(400).json({ error: 'Product not found.' });
        return;
    }

    // check if productUrl or desiredPrice is missing
    if (!productUrl || desiredPrice === undefined) {
        res.status(404).json({ error: 'Product URL not found or desired price not provided.' });
        return;
    }

    // check if desiredPrice is a number
    if (isNaN(desiredPrice)) {
        res.status(500).json({ error: 'Desired price must be a number.' });
        return;
    }

    const newAlert: Alert = { productUrl, desiredPrice, frequency };
    alerts.push(newAlert);

    if (checkPriceCondition(newAlert)) {
        res.status(200).json({ message: "Alert created and condition met, sending notification." });
        return;
    }

    // simulate scheduling the alert check
    if (frequency) {
        // can use setInterval or a job scheduler like node-cron in prod
        logger.verbose(`Scheduled alert for ${frequency}.`);
    }

    res.status(200).json({ message: "Alert has been set. We will notify you when the price condition is met.", alert: newAlert });
});

export default router;
