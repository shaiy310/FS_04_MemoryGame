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
                    onSelectDeck(value === '' ? null : Number(value));
                }}
            >
                <option value="">None</option>
                {decks.map((deck, index) => (
                <option key={deck.name} value={index}>{deck.name}</option>
                ))}
            </select>
            </label>
        </div>
    );
}

export default DeckSelector;