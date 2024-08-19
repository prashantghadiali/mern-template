// src/NoteList.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Select from 'react-select';
import { Link } from 'react-router-dom';
// import './App.css';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    color: '',
    options: [
      { value: 'red', label: 'RED' },
      { value: 'blue', label: 'BLUE' },
      { value: 'green', label: 'GREEN' },
      { value: 'white', label: 'WHITE' },
    ],
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const openModal = (noteId = null) => {
    if (noteId) {
      setIsEditing(true);
      fetchNoteById(noteId);
    } else {
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormValues({
      title: '',
      content: '',
      color: '',
      options: formValues.options,
    });
  };

  const fetchNoteById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`);
      const data = await response.json();
      setFormValues({
        title: data.title,
        content: data.content,
        color: data.color || '',
        options: formValues.options,
      });
      setCurrentNoteId(id);
    } catch (error) {
      console.error(`Error fetching note with id ${id}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setFormValues({
      ...formValues,
      color: selectedOption ? selectedOption.value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateNote();
    } else {
      await addNote();
    }
  };

  const addNote = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      setNotes([...notes, data]);
      closeModal();
    } catch (error) {
      console.error('Error adding a new note:', error);
    }
  };

  const updateNote = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${currentNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      setNotes(notes.map(note => note._id === currentNoteId ? data : note));
      closeModal();
    } catch (error) {
      console.error(`Error updating note with ID ${currentNoteId}:`, error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error(`Error deleting note with id ${id}:`, error);
    }
  };

  return (
    <div className="App">
      <h1>MERN Stack Notes App</h1>
      <Button variant="contained" color="primary" onClick={() => openModal()}>Add Note</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No notes available</TableCell>
              </TableRow>
            ) : (
              notes.map((note) => (
                <TableRow key={note._id}>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>{note.content}</TableCell>
                  <TableCell>{note.color || 'None'}</TableCell>
                  <TableCell>
                    <Link to={`/notes/${note._id}`}>
                      <Button variant="contained">View</Button>
                    </Link>
                    <Button variant="contained" color="error" onClick={() => deleteNote(note._id)}>Delete</Button>
                    <Button variant="contained" onClick={() => openModal(note._id)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{ padding: 20, backgroundColor: 'white', margin: 'auto', marginTop: '10%' }}>
          <h2 id="modal-title">{isEditing ? 'Edit Note' : 'Add Note'}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Content"
              name="content"
              value={formValues.content}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <Select
              options={formValues.options}
              placeholder="Select color"
              value={formValues.options.find(option => option.value === formValues.color)}
              onChange={handleSelectChange}
              isSearchable
              styles={{ container: (provided) => ({ ...provided, marginTop: 20 }) }}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              {isEditing ? 'Update Note' : 'Add Note'}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default NoteList;