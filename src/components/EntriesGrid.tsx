import {useEffect, useState} from 'react';

interface Entry {
  id: string;
  date: string;
  coffee: string;
  song: string;
  artist: string;
  album: string;
  notes: string;
}

export default function EntriesGrid() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry => {
    const search = searchTerm.toLowerCase();
    const coffee = entry.coffee.toLowerCase();
    const song = entry.song.toLowerCase();
    const artist = entry.artist.toLowerCase();

    return coffee.includes(search) ||
      song.includes(search) ||
      artist.includes(search);
  });

  useEffect(() => {
    const loadEntries = () => {
      const storedEntries = localStorage.getItem('BrewTuneEntries');
      const allEntries = storedEntries ? JSON.parse(storedEntries) : [];
      setEntries(allEntries);
    };
    loadEntries();

    window.addEventListener('entriesUpdated', loadEntries);

    return () => window.removeEventListener('entriesUpdated', loadEntries);
  }, []);

  // SEPARATE useEffect for search input
  useEffect(() => {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    if (!searchInput) return;

    const handleSearch = (e: Event) => {
      setSearchTerm((e.target as HTMLInputElement).value);
    };
    searchInput.addEventListener('input', handleSearch);

    return () => searchInput.removeEventListener('input', handleSearch);
  }, []);

  if (filteredEntries.length === 0 && entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">☕🎵</div>
        <p>No entries yet. Add your first coffee & music pairing!</p>
      </div>
    );
  }

  if (filteredEntries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <p>No entries found matching "{searchTerm}"</p>
      </div>
    );
  }

  const deleteEntry = (idToDelete: string)=> {
    const updateEntries = entries.filter(entry => entry.id !== idToDelete);

    setEntries(updateEntries);

    localStorage.setItem('BrewTuneEntries', JSON.stringify(updateEntries));

    console.log('Deleted entry: ', idToDelete);
    window.dispatchEvent(new Event('entriesUpdated'));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="entries-grid">
      {filteredEntries.map(entry => {
        return (
          <div key={entry.id} className="entry-card">
            {/* Album art or placeholder */}
            {entry.album ? (
              <img
                src={entry.album}
                alt={entry.song}
                className="album-art"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={entry.album ? 'hidden album-art' : 'album-art'}
              style={{
                background: 'linear-gradient(135deg, #6F4E37 0%, #C19A6B 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '4rem' }}>☕</span>
              <span style={{ fontSize: '2.5rem' }}>🎵</span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>
    No Album Art
  </span>
            </div>

            {/* Entry content */}
            <div className="entry-content">
              <div className="entry-header">
                <span className="entry-date">{formatDate(entry.date)}</span>
                <span className="coffee-badge">{entry.coffee}</span>
              </div>

              <div className="song-info">
                {entry.album ? (
                  <a href={entry.album} target="_blank" rel="noopener noreferrer" className="song-title song-link">
                    {entry.song}
                  </a>
                ) : (
                  <div className="song-title">{entry.song}</div>
                )}
                <div className="artist-name">{entry.artist}</div>
              </div>

              {entry.notes && (
                <div className="entry-notes">{entry.notes}</div>
              )}
              <div>
                <button onClick={() => deleteEntry(entry.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
