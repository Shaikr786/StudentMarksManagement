import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './StudentDataDisplay.css';
import SearchComponent from './SearchComponent';

const StudentDataDisplay = () => {
  const [studentData, setStudentData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = () => {
    axios.get('http://localhost:4000/students')
      .then(response => {
        const students = response.data.data;
        setStudentData(students);
        setFilteredData(students); // Initialize filteredData with the full student list
      })
      .catch(error => {
        console.error(error);
      });
  };

  const filterData = useCallback(() => {
    if (!searchValue) {
      setFilteredData(studentData);
      return;
    }

    const lowerCaseSearchValue = searchValue.toLowerCase();

    const filtered = studentData.filter(student => {
      const isMatchInMarks = student.marks.some(mark =>
        mark.subject.toLowerCase().includes(lowerCaseSearchValue) ||
        mark.marks.toString().includes(lowerCaseSearchValue)
      );

      return (
        student._id.toLowerCase().includes(lowerCaseSearchValue) ||
        student.name.toLowerCase().includes(lowerCaseSearchValue) ||
        student.branch.toLowerCase().includes(lowerCaseSearchValue) ||
        student.rollNo.toLowerCase().includes(lowerCaseSearchValue) ||
        isMatchInMarks
      );
    });

    setFilteredData(filtered);
  }, [searchValue, studentData]);

  useEffect(() => {
    filterData();
  }, [searchValue, studentData, filterData]);

  const handleDeleteStudent = (studentId) => {
    axios.delete(`http://localhost:4000/students/${studentId}`)
      .then(response => {
        console.log('Student deleted successfully:', response.data.message);
        fetchStudentData(); // Refresh the student data after deletion
      })
      .catch(error => {
        console.error('Error deleting student:', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    filterData();
  };

  return (
    <div className="StudentDataDisplay">
      <h1>Student Data Display</h1>

      <SearchComponent
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />

      <div className="card-container">
        {filteredData.map((student, index) => (
          <div key={index} className="card">
            <div className="left-side">
              <h2>{student.name}</h2>
              <p>Roll No: {student.rollNo}</p>
              <p>Branch: {student.branch}</p>
              <div className="action-buttons">
                <Link to={`/edit/${student._id}`} className="edit-link">
                  <button className="edit-button">Edit</button>
                </Link>
                <button className="delete-button" onClick={() => handleDeleteStudent(student._id)}>
                  Delete
                </button>
              </div>
            </div>
            <div className="right-side">
              <h2>Marks</h2>
              {student.marks.map((mark, index) => (
                <p key={index} className="mark-entry">
                  <span className="subject">{mark.subject}:</span> {mark.marks}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
};

export default StudentDataDisplay;
