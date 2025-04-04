import logger from "../util/logger";

export const sendNotification = (productUrl: string, currentPrice: number): void => {
    // for simulation purposes, just log the notification
    // but you would send an email or push notification in a real-world scenario
    logger.verbose(`Notification: The price of ${productUrl} is now £${currentPrice}`);
}