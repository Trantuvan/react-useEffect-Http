import React, { useEffect, useState } from "react";
import "./CharPicker.css";

function CharPicker({ side, selectedChar, onCharSelect }) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("charPicker rendered");
    setIsLoading(true);

    const controller = new AbortController();
    fetch("https://swapi.dev/api/people/", {
      signal: controller.signal,
    })
      .then((response) => {
        if (response.ok === false) {
          throw new Error(`Failed to fetch ${response.status}`);
        }
        return response.json();
      })
      .then((charData) => {
        const selectedChars = charData.results.slice(0, 5);
        const newCharacters = selectedChars.map((char, index) => ({
          id: index + 1,
          name: char.name,
        }));

        setCharacters(newCharacters);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.log(err);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  let content = <p>Loading characters...</p>;

  if (!isLoading && characters && characters.length > 0) {
    content = (
      <select onChange={onCharSelect} value={selectedChar} className={side}>
        {characters.map((char) => (
          <option key={char.id} value={char.id}>
            {char.name}
          </option>
        ))}
      </select>
    );
  } else if (!isLoading && (!characters || characters.length === 0)) {
    content = <p>Could not fetch any data.</p>;
  }
  return content;
}

export default CharPicker;
