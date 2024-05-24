import { CryptoCoin } from '../domain/models/crypto-coin';
import { HttpService } from '../domain/services/http-service';
import { CoinCapSearch } from './helpers/coin-cap-search';

export class CoinCapService {
    constructor(private readonly httpService: HttpService) { }

    async search(q: string): Promise<CryptoCoin[]> {
        const response = await this.httpService.get<CoinCapSearch>(
            'https://api.coincap.io/v2/assets',
            { search: q, limit: 5 }
        );

        return Promise.resolve(response.data.data.map((coin) => {
            return {
                id: coin.id,
                price: Number(Number(coin.priceUsd).toFixed(2)),
                icon: '', // TBD
                symbol: coin.symbol
            };
        }));
    }
}