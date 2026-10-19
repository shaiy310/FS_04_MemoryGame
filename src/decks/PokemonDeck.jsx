import { Deck } from "./Deck";

const randomIntFromInterval = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

class PokemonDeck extends Deck {
    constructor() {
        super('Pokemon', 'https://pokeapi.co/api/v2');
    }

    async getImages() {
        const images = [];
        for (let i = 0; i < 10; i++) {
            const id = randomIntFromInterval(1, 800);
            const data = await this.getData(`/pokemon/${id}`);
            images.push(data.sprites.front_default);
        }

        return images;
    }
}

export default PokemonDeck;