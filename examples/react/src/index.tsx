import React from 'react';
import clsx from 'clsx';

export const test = ({ isHovering }) => {
  const classes = clsx('rounded bg-blue-500 px-4 py-2 text-base text-white', {
    'bg-blue-700 text-gray-100': isHovering,
  });
  return <div className={classes}>hello world</div>;
};

export const test2 = () => {
  return <div className="bg-slate-600 text-white">hello world</div>;
};
