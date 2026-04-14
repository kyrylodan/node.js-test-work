import axios from "axios";

class ExhangeService {
    public async getRates(){
        const response = await axios.get("https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11")

        const data = response.data;

        const usd = data.find((item: any) => item.ccy === "USD");
        const eur = data.find((item: any) => item.ccy === "EUR");

        return {
            usd: Number(usd.sale),
            eur: Number(eur.sale),
            uah: 1
        };
    }
}
export const exchangeService = new ExhangeService();