import React, { useEffect, useState } from "react";

import Summary from "./Summary";

function Character({ selectedChar }) {
  const [loadedCharacter, setLoadedCharacter] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("character rendered");
    setIsLoading(true);

    const controller = new AbortController();
    fetch("https://swapi.dev/api/people/" + selectedChar, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not fetch person!");
        }
        return response.json();
      })
      .then((charData) => {
        setLoadedCharacter({
          id: selectedChar,
          name: charData.name,
          height: charData.height,
          colors: {
            hair: charData.hair_color,
            skin: charData.skin_color,
          },
          gender: charData.gender,
          movieCount: charData.films.length,
        });
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
  }, [selectedChar]);

  let content = <p>Loading Character...</p>;

  if (!isLoading && loadedCharacter.id) {
    content = (
      <Summary
        name={loadedCharacter.name}
        gender={loadedCharacter.gender}
        height={loadedCharacter.height}
        hairColor={loadedCharacter.colors.hair}
        skinColor={loadedCharacter.colors.skin}
        movieCount={loadedCharacter.movieCount}
      />
    );
  } else if (!isLoading && !loadedCharacter.id) {
    content = <p>Failed to fetch character.</p>;
  }
  return content;
}

export default Character;
