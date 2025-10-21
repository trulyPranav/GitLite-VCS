'use client';

export default function CreateRepoButton() {
  const handleClick = () => {
    alert('Create repo feature coming soon!');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
    >
      + New Repository
    </button>
  );
}
