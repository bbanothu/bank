export default function ErrorMessage({ error }) {
    if (!error) return null;
    
    return (
      <div className="max-w-7xl mx-auto mb-6 p-4 text-red-700 bg-red-100 rounded">
        {error}
      </div>
    );
  }