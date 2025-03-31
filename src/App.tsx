import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import DeckForm from './pages/DeckForm';
import DeckDetails from './pages/DeckDetails';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deck/new" element={<DeckForm />} />
      <Route path="/deck/edit/:id" element={<DeckForm />} />
      <Route path="/deck/:id" element={<DeckDetails />} />
    </Routes>
  </BrowserRouter>
);

export default App;