import React from "react";


function DeckSelector({ decks, selectedDeckIndex, onSelectDeck }) {
    return (
        <div className="deck-selector">
            <label className="deck-picker" htmlFor="deck-choice">
            <span>Choose a deck</span>
            <select
                id="deck-choice"
                value={selectedDeckIndex ?? ''}
                onChange={(event) => {
                    const value = event.target.value;
                    switch (value) {
                        case '':
                            onSelectDeck(null);
                            break;
                        case 'random':
                            const randomIndex = Math.floor(Math.random() * decks.length);
                            onSelectDeck(randomIndex);
                            break;
                        default:
                            onSelectDeck(Number(value));
                    }
                }}
            >
                <option value="">None</option>
                {decks.map((deck, index) => (
                <option key={deck.name} value={index}>{deck.name}</option>
                ))}
                <option value="random">Random Deck</option>
            </select>
            </label>
        </div>
    );
}

export default DeckSelector;