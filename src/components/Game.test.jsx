import { act, fireEvent, render, screen } from '@testing-library/react';
import Game from './Game';

const cards = [
  { id: 'first-a', image: '/image-a.jpg' },
  { id: 'second-a', image: '/image-a.jpg' },
  { id: 'first-b', image: '/image-b.jpg' },
  { id: 'second-b', image: '/image-b.jpg' },
];

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('scores a match for the current player', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<Game cards={cards} />);

  const cardButtons = screen.getAllByRole('button', { name: /Reveal card/ });
  fireEvent.click(cardButtons[0]);
  fireEvent.click(cardButtons[3]);

  expect(screen.getByText('Player 1').nextElementSibling.textContent).toBe('1');
  expect(screen.getByText('Player 2').nextElementSibling.textContent).toBe('0');
  expect(screen.getByRole('status').textContent).toBe("Player 1's turn");
});

test('changes turns after a mismatch is hidden', () => {
  jest.useFakeTimers();
  jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<Game cards={cards} />);

  const cardButtons = screen.getAllByRole('button', { name: /Reveal card/ });
  fireEvent.click(cardButtons[0]);
  fireEvent.click(cardButtons[1]);

  expect(screen.getByRole('status').textContent).toBe("Player 1's turn");
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByRole('status').textContent).toBe("Player 2's turn");
});

test('start over resets scores, hides cards, and shuffles the round', () => {
  const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
  render(<Game cards={cards} />);

  const cardButtons = screen.getAllByRole('button', { name: /Reveal card/ });
  fireEvent.click(cardButtons[0]);
  fireEvent.click(cardButtons[3]);
  expect(screen.getByText('Player 1').nextElementSibling.textContent).toBe('1');

  fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

  expect(randomSpy).toHaveBeenCalledTimes((cards.length - 1) * 2);
  expect(screen.getByText('Player 1').nextElementSibling.textContent).toBe('0');
  expect(screen.getByText('Player 2').nextElementSibling.textContent).toBe('0');
  expect(screen.getByRole('status').textContent).toBe("Player 1's turn");
  const resetCards = screen.getAllByRole('button', { name: /Reveal card/ });
  expect(resetCards).toHaveLength(4);
  expect(resetCards.every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
});