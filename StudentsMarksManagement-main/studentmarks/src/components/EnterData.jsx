import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import './EnterData.css';

function EnterData() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState('');
  const [marks, setMarks] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleAddSubject = () => {
    if (newSubject) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  const handleDeleteSubject = (subject) => {
    setSubjects(subjects.filter((s) => s !== subject));
    const newMarks = { ...marks };
    delete newMarks[subject];
    setMarks(newMarks);
  };

  const handleInputChange = (event, subject) => {
    const { value } = event.target;
    setMarks({ ...marks, [subject]: Number(value) });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const studentMarks = subjects.map((subject) => ({
      subject,
      marks: marks[subject] || 0,
    }));
    const studentData = {
      name: studentName,
      rollNo,
      branch,
      marks: studentMarks,
    };
    axios.post('http://localhost:4000/students', studentData)
      .then((response) => {
        setMessage(`Student added successfully! ID: ${response.data.data._id}`);
        navigate(`/success/${response.data.data._id}`);
      })
      .catch((error) => {
        setMessage(`prvide all details correctly: ${error.message}`);
      });
  };

  return (
    <div className="EnterData">
      <div className="left-column">
        <h1>Enter Student Data</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Student Name:
            <input type="text" value={studentName} onChange={(event) => setStudentName(event.target.value)} />
          </label>
          <br />
          <label>
            Roll No:
            <input type="text" value={rollNo} onChange={(event) => setRollNo(event.target.value)} />
          </label>
          <br />
          <label>
            Branch:
            <input type="text" value={branch} onChange={(event) => setBranch(event.target.value)} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </div>
      <div className="right-column">
        <h2>Marks</h2>
        {subjects.map((subject, index) => (
          <div key={index}>
            <label>
              {subject}:
              <input type="number" value={marks[subject] || ''} onChange={(event) => handleInputChange(event, subject)} />
            </label>
            <button type="button" onClick={() => handleDeleteSubject(subject)}>Delete</button>
            <br />
          </div>
        ))}
        <label>
          Add new subject:
          <input type="text" value={newSubject} onChange={(event) => setNewSubject(event.target.value)} />
        </label>
        <button type="button" onClick={handleAddSubject}>Add Subject</button>
      </div>
      <Link to="/">
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default EnterData;

