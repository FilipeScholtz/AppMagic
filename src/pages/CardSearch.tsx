import React, { useState } from 'react';

interface Card {
  id: string;
  name: string;
  imageUrl?: string;
}

interface CardSearchProps {
  onAddCard: (card: Card) => void;
}

const CardSearch: React.FC<CardSearchProps> = ({ onAddCard }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Card[]>([]);

  const searchCards = async () => {
    const res = await fetch(`https://api.magicthegathering.io/v1/cards?name=${query}`);
    const data = await res.json();

    const filtered: Card[] = [];
    const seenNames = new Set();

    data.cards.forEach((c: any) => {
      const ptName = c.foreignNames?.find((f: any) => f.language === 'Portuguese (Brazil)' && f.name?.toLowerCase().includes(query.toLowerCase()));
      const enMatch = c.name?.toLowerCase().includes(query.toLowerCase());

      if ((ptName || enMatch) && !seenNames.has(c.name)) {
        seenNames.add(c.name);
        filtered.push({
          id: c.id,
          name: ptName?.name || c.name,
          imageUrl: c.imageUrl || undefined,
        });
      }
    });

    setResults(filtered);
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Buscar Cartas</h2>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Nome da carta (EN)"
        className="border p-2 w-full mb-2"
      />
      <button onClick={searchCards} className="mb-4">Buscar</button>

      <ul>
        {results.map(card => (
          <li key={card.id} className="mb-4 flex items-center">
            {card.imageUrl && (
              <img src={card.imageUrl} alt={card.name} className="w-12 h-auto mr-2" />
            )}
            <span className="mr-2">{card.name} </span>
            <a
              href={`https://ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(card.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mr-2"
            >
              Ver na LigaMagic
            </a>
            <button onClick={() => onAddCard(card)} className="ml-2">Adicionar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardSearch;