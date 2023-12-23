// import React, { useState, useEffect } from 'react';

// const NoteForm = () => {
//   const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState({ title: '', content: '' });

//   useEffect(() => {
//     // Fetch all notes on component mount
//     fetch('http://localhost:5000/api/notes')
//       .then((res) => res.json())
//       .then((data) => setNotes(data))
//       .catch((error) => console.error('Error fetching notes:', error));
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewNote({
//       ...newNote,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Send a POST request to add a new note
//     fetch('http://localhost:5000/api/notes', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newNote),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setNotes([...notes, data]);
//         setNewNote({ title: '', content: '' });
//       })
//       .catch((error) => console.error('Error adding a new note:', error));
//   };

//   return (
//     <div>
//       <h2>Notes</h2>
//       <ul>
//         {notes.map((note) => (
//           <li key={note._id}>
//             <strong>{note.title}:</strong> {note.content}
//           </li>
//         ))}
//       </ul>
//       {/* <form onSubmit={handleSubmit}>
//         <label>
//           Title:
//           <input type="text" name="title" value={newNote.title} onChange={handleInputChange} />
//         </label>
//         <br />
//         <label>
//           Content:
//           <textarea name="content" value={newNote.content} onChange={handleInputChange} />
//         </label>
//         <br />
//         <button type="submit">Add Note</button>
//       </form> */}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Title:
//           <input type="text" name="title" value={newNote.title} onChange={handleInputChange} />
//         </label>
//         <br />
//         <label>
//           Content:
//           <textarea name="content" value={newNote.content} onChange={handleInputChange} />
//         </label>
//         <br />
//         <button type="submit">Add Note</button>
//       </form>
//     </div>
//   );
// };

// export default NoteForm;
