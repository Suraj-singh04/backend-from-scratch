const express = require('express');
const app = express();

app.use(express.json());

const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

const requestTimer = (req, res, next) => {
    const start = Date.now();

    res.on('finish', ()=> {
        const duration = Date.now() - start;
        console.log(`[${req.method} ${req.url}] completed in ${duration}ms`);
    })

    next();
}

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    })
}

app.use(logger);
app.use(requestTimer);

app.get('/ping', (req, res) => {
    res.json({ message: "pong" });
});

app.get('/error', (req, res, next) => {
    const err = new Error('Something went wrong!');
    err.status = 400;
    next(err);
})

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})