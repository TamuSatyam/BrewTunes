import { useEffect, useState } from "react";

interface Entry {
  id: string;
  date: string;
  coffee: string;
  song: string;
  artist: string;
  album: string;
  notes: string;
}

export default function Stats() {
  const [totalEntries, setTotalEntries] = useState(0);
  const [uniqueCoffees, setUniqueCoffees] = useState(0);
  const [favoriteCoffee, setFavoriteCoffee] = useState("-");

  useEffect(() => {
    const loadStats = () => {
      const storedEntries = localStorage.getItem("BrewTuneEntries");

      if (!storedEntries) {
        setTotalEntries(0);
        setUniqueCoffees(0);
        setFavoriteCoffee("-");

        return;
      }
      const entries: Entry[] = JSON.parse(storedEntries);

      setTotalEntries(entries.length);

      const coffeeTypes = entries.map((entry) => entry.coffee);
      const uniqueSet = new Set(coffeeTypes);
      setUniqueCoffees(uniqueSet.size);

      const counts: { [key: string]: number } = {};
      entries.forEach((entry) => {
        counts[entry.coffee] = (counts[entry.coffee] || 0) + 1;
      });
      let maxCount = 0;
      let mostCommon = "-";
      for (const coffee in counts) {
        if (counts[coffee] > maxCount) {
          maxCount = counts[coffee];
          mostCommon = coffee;
        }
      }
      setFavoriteCoffee(mostCommon);
    };
    loadStats();

    window.addEventListener("entriesUpdated", loadStats);

    return () => window.removeEventListener("entriesUpdated", loadStats);
  }, []);

  return (
    <section className="stats-section">
      <div className="stat-card">
        <span className="stat-value">{totalEntries}</span>
        <span className="stat-label">Total Entries</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{uniqueCoffees}</span>
        <span className="stat-label">Coffee Types</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{favoriteCoffee}</span>
        <span className="stat-label">Most Logged</span>
      </div>
    </section>
  );
}
