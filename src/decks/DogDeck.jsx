import { Deck } from "./Deck";

class DogDeck extends Deck {
    constructor() {
        super('Dog', 'https://dog.ceo/api');
    }

    async getImages() {
        const images = [];
        for (let i = 0; i < 10; i++) {
            const data = await this.getData('/breeds/image/random');
            images.push(data.message);
        }

        return images;
    }
}

export default DogDeck;