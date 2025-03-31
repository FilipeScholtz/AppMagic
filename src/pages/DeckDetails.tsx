import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Card {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Deck {
  id: string;
  name: string;
  cards: Card[];
}

const DeckDetails: React.FC = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('decks');
    if (saved) {
      const parsed: Deck[] = JSON.parse(saved);
      const found = parsed.find(d => d.id === id);
      setDeck(found || null);
    }
  }, [id]);

  if (!deck) return <div className="p-4">Deck não encontrado.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{deck.name}</h1>
      <h2 className="text-lg font-semibold mb-2">Cartas</h2>
      <ul>
        {deck.cards.map(card => (
          <li key={card.id} className="mb-4 flex items-center">
            {card.imageUrl && (
              <img src={card.imageUrl} alt={card.name} className="w-12 h-auto mr-2" />
            )}
            <span>{card.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeckDetails;
