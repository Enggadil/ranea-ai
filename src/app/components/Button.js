'use client';

export function Button({ text, onClick, outline }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-lg font-semibold rounded-full ${
        outline
          ? 'border border-blue-600 text-blue-600 hover:bg-blue-100'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } transition`}
    >
      {text}
    </button>
  );
}
