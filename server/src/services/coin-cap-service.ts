import { CryptoCoin } from '../domain/models/crypto-coin';

export class CoinCapService {
    search(q: string): Promise<CryptoCoin[]> {
        return Promise.resolve([]);
    }
}