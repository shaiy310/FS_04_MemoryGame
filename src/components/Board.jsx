import React from "react";
import "./Board.css";
import MemoryCard from "./MemoryCard";

function Board({ cards, onPairMatch, onPairMismatch }) {
    const [flippedCardIds, setFlippedCardIds] = React.useState([]); // current flipped pair
    const [matchedCardIds, setMatchedCardIds] = React.useState(() => new Set());
    const [showWaitMessage, setShowWaitMessage] = React.useState(false);
    const isLocked = React.useRef(false);
    const mismatchTimeout = React.useRef(null);
    const waitMessageTimeout = React.useRef(null);

    React.useEffect(() => () => {
        if (mismatchTimeout.current !== null) {
            window.clearTimeout(mismatchTimeout.current);
        }
        if (waitMessageTimeout.current !== null) {
            window.clearTimeout(waitMessageTimeout.current);
        }
    }, []);

    function handleCardClick(card) {
        if (isLocked.current) {
            setShowWaitMessage(true);
            if (waitMessageTimeout.current !== null) {
                window.clearTimeout(waitMessageTimeout.current);
            }
            waitMessageTimeout.current = window.setTimeout(() => {
                setShowWaitMessage(false);
                waitMessageTimeout.current = null;
            }, 1000);
            return;
        }
        if (
            flippedCardIds.includes(card.id) ||
            matchedCardIds.has(card.id)
        ) {
            // Ignore clicks on already flipped or matched cards
            return;
        }

        // If first flipped card, just flip it and return.
        if (flippedCardIds.length === 0) {
            setFlippedCardIds([card.id]);
            return;
        }

        const firstCardId = flippedCardIds[0];
        const firstCard = cards.find((candidate) => candidate.id === firstCardId);

        // If the pair matches
        if (firstCard.image === card.image) {
            setMatchedCardIds((currentMatchedIds) =>
                new Set([...currentMatchedIds, firstCardId, card.id]),
            );
            setFlippedCardIds([]);
            onPairMatch();
            return;
        }

        setFlippedCardIds([firstCardId, card.id]);
        isLocked.current = true;
        mismatchTimeout.current = window.setTimeout(() => {
            setFlippedCardIds([]);
            isLocked.current = false;
            mismatchTimeout.current = null;
            onPairMismatch();
        }, 1000);
    }

    return (
        <div>
            {showWaitMessage && (
                <div className="board-wait-message" role="status">
                    Wait your turn...
                </div>
            )}
            <div className="board" aria-label="Matching cards">
                {cards.map((card, index) => {
                    const isMatched = matchedCardIds.has(card.id);
                    const isRevealed = isMatched || flippedCardIds.includes(card.id);

                    return (
                        <MemoryCard
                            key={card.id}
                            card={card}
                            cardNumber={index + 1}
                            isMatched={isMatched}
                            isRevealed={isRevealed}
                            onClick={() => handleCardClick(card)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Board;