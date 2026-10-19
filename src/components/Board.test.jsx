import { act, fireEvent, render, screen } from '@testing-library/react';
import Board from './Board';

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

test('keeps matching cards revealed and reports the match', () => {
  const onPairMatch = jest.fn();
  const onPairMismatch = jest.fn();
  render(<Board cards={cards} onPairMatch={onPairMatch} onPairMismatch={onPairMismatch} />);

  const cardButtons = screen.getAllByRole('button', { name: /Reveal card/ });
  fireEvent.click(cardButtons[0]);
  fireEvent.click(cardButtons[1]);

  expect(cardButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(cardButtons[1].getAttribute('aria-pressed')).toBe('true');
  expect(cardButtons[0].classList.contains('is-matched')).toBe(true);
  expect(cardButtons[1].classList.contains('is-matched')).toBe(true);
  expect(onPairMatch).toHaveBeenCalledTimes(1);
  expect(onPairMismatch).not.toHaveBeenCalled();
});

test('turns mismatched cards back after one second and reports the mismatch', () => {
  jest.useFakeTimers();
  const onPairMatch = jest.fn();
  const onPairMismatch = jest.fn();
  render(<Board cards={cards} onPairMatch={onPairMatch} onPairMismatch={onPairMismatch} />);

  const cardButtons = screen.getAllByRole('button', { name: /Reveal card/ });
  fireEvent.click(cardButtons[0]);
  fireEvent.click(cardButtons[2]);

  expect(cardButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(cardButtons[2].getAttribute('aria-pressed')).toBe('true');

  act(() => jest.advanceTimersByTime(999));
  expect(cardButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(onPairMismatch).not.toHaveBeenCalled();

  act(() => jest.advanceTimersByTime(1));
  expect(cardButtons[0].getAttribute('aria-pressed')).toBe('false');
  expect(cardButtons[2].getAttribute('aria-pressed')).toBe('false');
  expect(onPairMismatch).toHaveBeenCalledTimes(1);
  expect(onPairMatch).not.toHaveBeenCalled();
});

test('shows a one-second message when a card is clicked while the board is locked', () => {
  jest.useFakeTimers();
  render(<Board cards={cards} onPairMatch={jest.fn()} onPairMismatch={jest.fn()} />);

  const cardButtons = screen.getAllByRole('button', { name: /Reveal card/ });
  fireEvent.click(cardButtons[0]);
  fireEvent.click(cardButtons[2]);
  fireEvent.click(cardButtons[1]);

  expect(screen.getByRole('status').textContent).toBe('Wait your turn...');
  expect(cardButtons[1].getAttribute('aria-pressed')).toBe('false');

  act(() => jest.advanceTimersByTime(999));
  expect(screen.queryByRole('status')).not.toBeNull();

  act(() => jest.advanceTimersByTime(1));
  expect(screen.queryByRole('status')).toBeNull();
});
