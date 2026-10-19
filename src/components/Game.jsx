import React from "react";
import Board from "./Board";
import "./Game.css";
import { shuffle } from "../utils";

function Game({ cards }) {
    const [round, setRound] = React.useState(() => ({
        cards: shuffle(cards),
        key: 0,
    }));
    const [scores, setScores] = React.useState([0, 0]);
    const [currentPlayer, setCurrentPlayer] = React.useState(0);
    const gameEndTimeout = React.useRef(null);

    React.useEffect(() => () => {
        if (gameEndTimeout.current !== null) {
            window.clearTimeout(gameEndTimeout.current);
        }
    }, []);

    function handlePairMatch() {
        setScores((currentScores) =>
            currentScores.map((score, player) =>
                player === currentPlayer ? score + 1 : score,
            ),
        );

        if (round.cards.length === 2 * (scores[0] + scores[1] + 1)) {
            
            gameEndTimeout.current = window.setTimeout(() => {
                const winner = scores[0] > scores[1] ? 0 : scores[0] === scores[1] ? currentPlayer : 1;
                alert(`Player ${winner + 1} wins!`);
                handleStartOver();
            }, 500);
        }
    }

    function handlePairMismatch() {
        setCurrentPlayer((player) => 1 - player);
    }

    function handleStartOver() {
        setScores([0, 0]);
        setCurrentPlayer(0);
        setRound((currentRound) => ({
            cards: shuffle(cards),
            key: currentRound.key + 1,
        }));
    }

    return (
        <div className="game-layout">
            <Board
                key={round.key}
                cards={round.cards}
                onPairMatch={handlePairMatch}
                onPairMismatch={handlePairMismatch}
            />

            <aside className="control-panel" aria-label="Game controls">
                <h2 className="control-panel-title">Score</h2>
                {[0, 1].map((player) => (
                    <div
                        key={player}
                        className={`player-score${currentPlayer === player ? ' is-active' : ''}`}
                    >
                        <span>Player {player + 1}</span>
                        <strong>{scores[player]}</strong>
                    </div>
                ))}
                <button className="start-over-button" type="button" onClick={handleStartOver}>
                    Start over
                </button>
            </aside>
        </div>
    );
}

export default Game;