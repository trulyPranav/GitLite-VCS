'use client';

export default function FileItem({ file, isSelected, onSelect }) {
  return (
    <li
      onClick={onSelect}
      className={`cursor-pointer px-3 py-2 rounded ${
        isSelected ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100'
      }`}
    >
      {file.name}
    </li>
  );
}
