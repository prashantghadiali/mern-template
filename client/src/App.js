import React, { useState, useEffect } from "react";
import Select from "react-select";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "", // Added to track selected color
    options: [
      { value: "red", label: "RED" },
      { value: "blue", label: "BLUE" },
      { value: "green", label: "GREEN" },
      { value: "white", label: "WHITE" },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote({
      ...newNote,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setNewNote({
      ...newNote,
      color: selectedOption ? selectedOption.value : "",
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchNoteById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`);
      const data = await response.json();
      setSelectedNote(data);
      setNewNote({
        title: data.title,
        content: data.content,
        color: data.color || "",
        options: newNote.options,
      });
    } catch (error) {
      console.error(`Error fetching note with id ${id}:`, error);
    }
  };

  const addNote = async (note) => {
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      const data = await response.json();
      setNotes([...notes, data]);

      // Clear the input fields after successful submission
      setNewNote({
        title: "",
        content: "",
        color: "",
      });
    } catch (error) {
      console.error("Error adding a new note:", error);
    }
  };

  const updateNote = async (noteId, updatedNote) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNote),
        }
      );

      const data = await response.json();

      // Update the notes array with the updated note
      const updatedNotes = notes.map((note) =>
        note._id === noteId ? { ...note, ...data } : note
      );

      setNotes(updatedNotes);
      setSelectedNote(null); // Clear the selected note after updating

      // Clear the form fields
      setNewNote({
        title: "",
        content: "",
        color: "",
      });
    } catch (error) {
      console.error(`Error updating note with ID ${noteId}:`, error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
      });

      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error(`Error deleting note with id ${id}:`, error);
    }
  };

  return (
    <div className="App">
      <h1>MERN Stack Notes App</h1>
      {/* Display the list of notes */}
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            {note.title} - {note.content} - Color: {note.color || "None"}
            {/* Add buttons for actions (view, update, delete) */}
            <button onClick={() => fetchNoteById(note._id)}>View</button>
            <button onClick={() => setSelectedNote(note)}>Update</button>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Display details of the selected note */}
      {selectedNote && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateNote(selectedNote._id, {
              title: newNote.title || selectedNote.title,
              content: newNote.content || selectedNote.content,
              color: newNote.color || selectedNote.color,
            });
          }}
        >
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newNote.title}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Content:
            <textarea
              name="content"
              value={newNote.content}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <div style={{ margin: 20, width: 200 }}>
            <Select
              options={newNote.options}
              placeholder="Select color"
              value={newNote.options.find((option) => option.value === newNote.color)}
              onChange={handleSelectChange}
              isSearchable
            />
          </div>
          <button type="submit">Update Note</button>
        </form>
      )}

      {/* Add a new note */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNote({
            title: newNote.title || "New Note",
            content: newNote.content || "New Content",
            color: newNote.color || "white", // Default color if not selected
          });
        }}
      >
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={newNote.title}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Content:
          <textarea
            name="content"
            value={newNote.content}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <div style={{ margin: 20, width: 200 }}>
          <Select
            options={newNote.options}
            placeholder="Select color"
            value={newNote.options.find((option) => option.value === newNote.color)}
            onChange={handleSelectChange}
            isSearchable
          />
        </div>
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default App;
