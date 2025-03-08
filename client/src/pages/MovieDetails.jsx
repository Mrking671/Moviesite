import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movie/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  const handleDownload = async (fileId) => {
    try {
      const response = await fetch(`/api/download/${fileId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Download failed');
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={movie.Poster} className="w-96 rounded-lg" />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
          <div className="grid grid-cols-2 gap-4">
            {movie.files?.map(file => (
              <button
                key={file.fileId}
                onClick={() => handleDownload(file.fileId)}
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <div>{file.quality}</div>
                <div className="text-sm">{file.size}MB</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
