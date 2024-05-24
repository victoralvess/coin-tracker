import { env } from 'node:process';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { CoinCapService } from './src/services/coin-cap-service';
import { AxiosHttpService } from './src/services/axios-http-service';
import axios from 'axios';
import { CoinCapSearchValidator } from './src/services/utils/coin-cap-search-validator';
import { SearchCoins } from './src/application/use-cases/search-coins';
import { SearchCoinsValidator } from './src/application/utils/search-coins-validator';
import { ValidationError } from './src/domain/utils/validation-error';
import { RequestError } from './src/services/helpers/request-error';
import { UnknownServerError } from './src/services/helpers/unknown-server-error';

function asyncRoute(cb: (req: Request, res: Response) => Promise<void>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cb(req, res);
        } catch (error) {
            next(error);
        }
    }; 
}

const app = express();

app.get('/ping', (req: Request, res: Response) => {
    res.send('PONG');
});

const searchCoins = new SearchCoins(
    new CoinCapService(new AxiosHttpService(axios), new CoinCapSearchValidator()),
    new SearchCoinsValidator()
);

app.get('/coins', asyncRoute(async (req: Request, res: Response) => {
    const result = await searchCoins.searchCoins(req.query as { q: string });
    res.json(result);
}));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        res.status(err.status).json({ message: err.message, errors: err.errors });
    } else if (err instanceof RequestError) {
        res.status(err.status).json({ message: err.message, data: err.data });
    } else if (err instanceof UnknownServerError) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Something else went wrong' });
    }
});

const PORT = Number(env.PORT ?? 3000);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});