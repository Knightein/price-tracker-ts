import express = require('express');
import bodyParser = require('body-parser');
import alertRouter from './routes/alertRoutes';
import logger from "./util/logger";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/alerts', alertRouter);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
})


