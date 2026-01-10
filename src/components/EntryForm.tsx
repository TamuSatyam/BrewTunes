import { type FormEvent, useState } from "react";

export default function EntryForm() {
    const [date, setDate] = useState('');
    const [coffee, setCoffee] = useState('');
    const [song, setSong] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const newEntry = {
            id: Date.now().toString(),
            date: date,
            coffee: coffee,
            song: song,
            artist: artist,
            album: album,
            notes: notes
        };
        const existingEntries = localStorage.getItem('BrewTuneEntries');
        const allEntries = existingEntries ? JSON.parse(existingEntries) : [];

        allEntries.push(newEntry);

        localStorage.setItem('BrewTuneEntries', JSON.stringify(allEntries));
        window.dispatchEvent(new Event('entriesUpdated'));

        setDate('');
        setCoffee('');
        setSong('');
        setArtist('');
        setAlbum('');
        setNotes('');

        console.log('Entry saved!', allEntries);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="coffee">Coffee</label>
                    <input
                        id="coffee"
                        value={coffee}
                        onChange={(e) => setCoffee(e.target.value)}
                        placeholder="e.g., Cappuccino"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="song">Song</label>
                    <input
                        id="song"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                        placeholder="e.g., Blinding Lights"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="artist">Artist</label>
                    <input
                        id="artist"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        placeholder="e.g., The Weeknd"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="Album">Album</label>
                    <input
                        id="album"
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                        placeholder="e.g., https://open.spotify.com/track/44MHQm2WIvsAXg14WKpCQp"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., How's the vibe?"
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                Add Entry
            </button>
        </form>
    );
}
