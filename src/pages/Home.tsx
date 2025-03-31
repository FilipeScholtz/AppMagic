import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Deck {
  id: string;
  name: string;
  cards?: any[];
}

const Home: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('decks');
    if (saved) setDecks(JSON.parse(saved));
  }, []);

  const deleteDeck = (id: string) => {
    const updated = decks.filter(deck => deck.id !== id);
    setDecks(updated);
    localStorage.setItem('decks', JSON.stringify(updated));
  };

  const exportDecks = () => {
    const dataStr = JSON.stringify(decks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decks.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDecks = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (Array.isArray(imported)) {
          setDecks(imported);
          localStorage.setItem('decks', JSON.stringify(imported));
        }
      } catch (e) {
        alert('Erro ao importar JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Meus Decks</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={() => navigate('/deck/new')}>Novo Deck</button>
        <br></br>
        <button onClick={exportDecks}>Exportar</button>
        <br></br>
        <label className="cursor-pointer">
          <span className="underline text-blue-600">Importar:</span>
          <input type="file" accept="application/json" onChange={importDecks} className="hidden" />
        </label>
      </div>
      <ul>
        {decks.map(deck => (
          <li key={deck.id} className="mb-2">
            <span onClick={() => navigate(`/deck/${deck.id}`)}>{deck.name}</span>
            <button onClick={() => navigate(`/deck/edit/${deck.id}`)} className="ml-2">Editar</button>
            <button onClick={() => deleteDeck(deck.id)} className="ml-2 text-red-600">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
