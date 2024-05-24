import { CoinCapService } from '../../src/services/coin-cap-service';
import { HttpService } from '../../src/domain/services/http-service';
import { HttpResponse } from '../../src/domain/services/helpers/http-response';
import { CoinCapSearch } from '../../src/services/helpers/coin-cap-search';
import { CryptoCoin } from '../../src/domain/models/crypto-coin';
import { Validator } from '../../src/domain/utils/validator';
import { CoinCapSearchValidator } from '../../src/services/utils/coin-cap-search-validator';

describe('CoinCapService', () => {
    let coinCapService: CoinCapService;
    let httpService: TestHttpService;
    let searchValidator: Validator<CoinCapSearch, CryptoCoin[]>;

    class TestHttpService implements HttpService {
        public url?: string;
        public params?: Record<string, unknown>;
        private response?: HttpResponse<any>;

        get<T>(url: string, params: Record<string, unknown>): Promise<HttpResponse<T>> {
            this.url = url;
            this.params = params;
            return Promise.resolve(this.response!);
        }

        setResponse<T>(response: HttpResponse<T>) {
            this.response = response;
        }
    }

    beforeEach(() => {
        httpService = new TestHttpService();
        searchValidator = new CoinCapSearchValidator();
        coinCapService = new CoinCapService(httpService, searchValidator);
    });

    describe('#search', () => {
        it('should return a list of cryptocurrencies correctly', async () => {
            const q = 'bitcoin';

            const response: HttpResponse<CoinCapSearch> = {
                status: 200,
                data: {
                    data: [{
                        id: 'bitcoin',
                        rank: '1',
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        supply: '17193925.0000000000000000',
                        maxSupply: '21000000.0000000000000000',
                        marketCapUsd: '119150835874.4699281625807300',
                        volumeUsd24Hr: '2927959461.1750323310959460',
                        priceUsd: '6929.8217756835584756',
                        changePercent24Hr: '-0.8101417214350335',
                        vwap24Hr: '7175.0663247679233209'
                    }]
                }
            };

            httpService.setResponse(response);

            const result: CryptoCoin[] = [{
                id: 'bitcoin',
                icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png',
                price: 6929.82,
                symbol: 'BTC'
            }];

            await expect(coinCapService.search(q)).resolves.toEqual(result);
            expect(httpService.url).toBe('https://api.coincap.io/v2/assets');
            expect(httpService.params).toEqual({ search: q, limit: 5 });
        });
    });
});