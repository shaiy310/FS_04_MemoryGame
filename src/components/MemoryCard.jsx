import React from "react";
import "./MemoryCard.css";

function MemoryCard({ card, cardNumber, isMatched, isRevealed, onClick }) {
    const className = [
        'memory-card',
        isRevealed && 'is-revealed',
        isMatched && 'is-matched',
    ].filter(Boolean).join(' ');

    const labelState = isMatched ? 'Matched' : isRevealed ? 'Revealed' : 'Reveal';

    return (
        <button
            type="button"
            className={className}
            aria-label={`${labelState} card ${cardNumber}`}
            aria-pressed={isRevealed}
            onClick={onClick}
        >
            <span className="memory-card-inner">
                {
                    isRevealed ? 
                        <span className="memory-card-face" aria-hidden={!isRevealed}>
                            <img src={card.image} alt="" />
                        </span>
                    :
                        <span className="memory-card-back" aria-hidden="true">?</span> 
                }
                
            </span>
        </button>
    );
}

export default MemoryCard;