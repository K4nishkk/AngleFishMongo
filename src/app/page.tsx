'use client'

import React, { useState } from 'react';

const Home = () => {
  const handleCreate = async () => {
    const res = await fetch('/api/upload', { method: 'POST'});
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={handleCreate}>Create file</button>
    </div>
  );
};

export default Home;
