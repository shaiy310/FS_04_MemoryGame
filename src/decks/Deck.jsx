export class Deck {
    constructor(name, link) {
        this.name = name;
        this.link = link;
    }
    
    async getData(uri, headers) {
        const fullUrl = `${this.link}${uri}`;
        const response = await fetch(fullUrl, { headers : headers });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    
    async getImages() {
        throw new Error('getImages() must be implemented by a subclass');
    }
}