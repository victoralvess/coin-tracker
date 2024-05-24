import { CryptoCoin } from '../domain/models/crypto-coin';
import { HttpService } from '../domain/services/http-service';
import { COINCAP_URL } from '../domain/utils/constants';
import { Validator } from '../domain/utils/validator';
import { CoinCapSearch } from './helpers/coin-cap-search';

export class CoinCapService {
    constructor(
        private readonly httpService: HttpService,
        private readonly searchValidator: Validator<CoinCapSearch, CryptoCoin[]>
    ) { }

    async search(q: string): Promise<CryptoCoin[]> {
        const response = await this.httpService.get<CoinCapSearch>(
            `${COINCAP_URL}/assets`,
            { search: q, limit: 5 }
        );

        return this.searchValidator.validate(response.data);
    }
}