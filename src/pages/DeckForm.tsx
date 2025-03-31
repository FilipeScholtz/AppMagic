import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CardSearch from './CardSearch';

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

const DeckForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('decks');
    if (saved) {
      const parsed = JSON.parse(saved);
      setDecks(parsed);
      if (id) {
        const deck = parsed.find((d: Deck) => d.id === id);
        if (deck) {
          setName(deck.name);
          setCards(deck.cards);
        }
      }
    }
  }, [id]);

  const saveDeck = () => {
    let updated: Deck[];
    if (id) {
      updated = decks.map(d => d.id === id ? { ...d, name, cards } : d);
    } else {
      const newDeck: Deck = { id: uuidv4(), name, cards };
      updated = [...decks, newDeck];
    }
    localStorage.setItem('decks', JSON.stringify(updated));
    navigate('/');
  };

  const addCard = (card: Card) => {
    if (!cards.find(c => c.id === card.id)) {
      setCards(prev => [...prev, card]);
    }
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{id ? 'Editar Deck' : 'Novo Deck'}</h1>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nome do deck"
        className="border p-2 w-full mb-4"
      />

      <h2 className="text-lg font-semibold mt-4 mb-2">Cartas no Deck</h2>
      <ul className="mb-4">
        {cards.map(card => (
          <li key={card.id} className="mb-2 flex items-center">
            {card.imageUrl && (
              <img src={card.imageUrl} alt={card.name} className="w-12 h-auto mr-2" />
            )}
            <span>{card.name} </span>
            <button onClick={() => removeCard(card.id)} className="ml-2 text-red-600">Remover</button>
          </li>
        ))}
      </ul>

      <CardSearch onAddCard={addCard} />

      <button onClick={saveDeck} className="mr-2 mt-4">Salvar</button>
      <button onClick={() => navigate('/')}>Cancelar</button>
    </div>
  );
};

export default DeckForm;