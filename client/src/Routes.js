import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoteList from './components/NoteList.js';
import NoteDetails from './components/NoteDetails.js';

const Router = () => (
  <Routes>
    <Route path="/" element={<NoteList />} />
    <Route path="/notes/:id" element={<NoteDetails />} />
  </Routes>
);

export default Router;