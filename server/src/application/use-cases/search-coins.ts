import type { CryptoCoin } from '../../domain/models/crypto-coin';
import type { CoinCapService } from '../../services/coin-cap-service';

export class SearchCoins {
    constructor(private readonly coinCapService: CoinCapService) { }

    async searchCoins(params: { q: string }): Promise<{ data: CryptoCoin[] }> {
        const result = await this.coinCapService.search(params.q);
        return { data: result };
    }
}