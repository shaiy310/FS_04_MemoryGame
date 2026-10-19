import { Deck } from "./Deck";

class HarryPotterDeck extends Deck {
    constructor() {
        super('Harry Potter', 'https://hp-api.onrender.com/api');
    }

    async getImages() {
        const data = await this.getData('/characters');
        const images = data.map((character) => character.image).filter((image) => image); // Filter out empty strings

        for (let index = images.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [images[index], images[randomIndex]] = [images[randomIndex], images[index]];
        }

        return images.slice(0, 10);
    }
}


export default HarryPotterDeck;