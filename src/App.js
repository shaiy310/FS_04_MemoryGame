import React from 'react';
import './App.css';
import Game from './components/Game';
import CountryDeck from './decks/CountryDeck';
import DogDeck from "./decks/DogDeck";
import HarryPotterDeck from './decks/HarryPotterDeck';
import PokemonDeck from "./decks/PokemonDeck";
import DeckSelector from './components/DeckSelector';

const decks = [
  new CountryDeck(),
  new DogDeck(),
  new HarryPotterDeck(),
  new PokemonDeck(),
];

function App() {
  const [selectedDeckIndex, setSelectedDeckIndex] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');

  function onDeckSelect(selectedDeckIndex) {
    setSelectedDeckIndex(selectedDeckIndex);
    let isCurrentRequest = true;
    setCards([]);
    setError('');

    if (selectedDeckIndex === null) {
      setStatus('idle');
      return () => {
        isCurrentRequest = false;
      };
    }

    setStatus('loading');

    const loadDeck = async () => {
      try {
        const images = await decks[selectedDeckIndex].getImages();
        if (!isCurrentRequest) return;

        const uniqueImages = [...new Set(images.filter(Boolean))].slice(0, 8);
        if (uniqueImages.length < 8) {
          throw new Error('This deck needs at least 8 unique images to make a board.');
        }

        const pairedCards = uniqueImages.flatMap((image, pairIndex) => [
          { id: `${pairIndex}-first`, image },
          { id: `${pairIndex}-second`, image },
        ]);

        setCards(pairedCards);
        setStatus('ready');
      } catch (loadError) {
        if (!isCurrentRequest) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load this deck.');
        setStatus('error');
      }
    };

    loadDeck();
    return () => {
      isCurrentRequest = false;
    };
  }
  
  React.useEffect(() => {
    onDeckSelect(selectedDeckIndex);
  }, [selectedDeckIndex]);

  return (
    <main className="App">
      <header className="page-header">
        <div className="title-block">
          <p className="eyebrow">A picture-matching game</p>
          <h1>Memory Match</h1>
        </div>
        <DeckSelector decks={decks} selectedDeckIndex={selectedDeckIndex} onSelectDeck={onDeckSelect} />
      </header>

      <section className="game-section" aria-labelledby="board-heading">
        {status === 'loading' && <p className="feedback" role="status">Loading images...</p>}
        {status === 'idle' && <p className="feedback">Choose a deck to start.</p>}
        {status === 'error' && <p className="feedback error" role="alert">{error}</p>}
        {status === 'ready' && <Game cards={cards} />}
      </section>
    </main>
  );
}

export default App;
