import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, TextField } from '@mui/material';
import Select from 'react-select';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
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
    fetchNoteById(id);
  }, [id]);

  const fetchNoteById = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`);
      const data = await response.json();
      setNote(data);
      setFormValues({
        title: data.title,
        content: data.content,
        color: data.color || '',
        options: formValues.options,
      });
    } catch (error) {
      console.error(`Error fetching note with id ${noteId}:`, error);
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
    await updateNote();
  };

  const updateNote = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      setNote(data);
      navigate('/');
    } catch (error) {
      console.error(`Error updating note with ID ${id}:`, error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Note Details</h2>
      <Button variant="contained" onClick={() => setModalOpen(true)}>Edit Note</Button>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{ padding: 20, backgroundColor: 'white', margin: 'auto', marginTop: '10%' }}>
          <h2 id="modal-title">Edit Note</h2>
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
              Update Note
            </Button>
            <Button type="button" onClick={closeModal} style={{ marginLeft: 10 }}>
              Close
            </Button>
          </form>
        </div>
      </Modal>
      <Button variant="contained" onClick={() => navigate('/')}>Back to List</Button>
    </div>
  );
};

export default NoteDetails;