import type { CryptoCoin } from '../../domain/models/crypto-coin';
import { Validator } from '../../domain/utils/validator';
import type { CoinCapService } from '../../services/coin-cap-service';

export class SearchCoins {
    constructor(
        private readonly coinCapService: CoinCapService,
        private readonly paramsValidator: Validator<{ q: string }, { q: string }>
    ) { }

    async searchCoins(params: { q: string }): Promise<{ data: CryptoCoin[] }> {
        params = this.paramsValidator.validate(params);
        const result = await this.coinCapService.search(params.q);
        return { data: result };
    }
}