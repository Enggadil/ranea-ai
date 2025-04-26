'use client';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-12">
      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}