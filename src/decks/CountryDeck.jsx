import REST_COUNTRY_API_KEY from "./config.js";
import { Deck } from "./Deck";

class CountryDeck extends Deck {
    constructor() {
        super('Country', 'https://api.restcountries.com/countries/v5');
    }

    async getImages() {
        const images = [];
        const data = await this.getData('?response_fields=flag.url_png', { 'Authorization': 'Bearer ' + REST_COUNTRY_API_KEY });
        
        data.data.objects.forEach((country) => {
            if (country.flag && country.flag.url_png) {
                images.push(country.flag.url_png);
            }
        });

        return images;
    }
}

export default CountryDeck;