import React from 'react';

const AppSpinner = () => {
  return (
    <div className="spinner-border text-success animate-spin" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default AppSpinner;