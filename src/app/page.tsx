'use client'

import React from 'react';

const Home: React.FC = () => {
  const handleCreate = async () => {
    console.log('Create task triggered');
    try {
      const response = await fetch('/api/fileOperations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Adjust if sending JSON
        },
        body: JSON.stringify({
          // Include necessary data for file creation, e.g., file details
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.log('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRead = () => {
    console.log('Read task triggered');
  };

  const handleUpdate = () => {
    console.log('Update task triggered');
  };

  const handleDelete = () => {
    console.log('Delete task triggered');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>File Operations</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleCreate}
        >
          Create
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleRead}
        >
          Read
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#F44336',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Home;
