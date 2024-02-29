import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Photo {
  id: string;
  urls: {
    full: string;
  };
  alt_description?: string;
}

const SearchImage: React.FC = () => {
  const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');

  const accesKey: string = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";
  const apiEndpoints: string = `https://api.unsplash.com/search/photos`; // Changed to search endpoint
  const perPage: number = 20;

  const bottomOfPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset page to 1 for a new search to start fresh
    setPage(1);
    setPopularPhotos([]); // Clear existing photos on new search
    fetchImages();
  }, [searchWord]); // Depend on searchWord to refetch when it changes

  useEffect(() => {
    const handleScroll = () => {
      if (
        bottomOfPageRef.current &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      ) {
        loadMoreImages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Removed dependencies to set up once

  const fetchImages = async () => {
    if (searchWord.trim()) { // Only fetch if searchWord is not empty
      try {
        setLoading(true);
        const response = await axios.get(apiEndpoints, {
          params: {
            client_id: accesKey,
            page,
            per_page: perPage,
            query: searchWord,
          },
        });
        setPopularPhotos(response.data.results); // Adjusted for search endpoint
        setPage(prev => prev + 1); // Prepare for next page fetch
        setLoading(false);
      } catch (error) {
        console.log("Images not found:", error);
      }
    }
  };

  const loadMoreImages = async () => {
    if (!loading && searchWord.trim()) {
      try {
        setLoading(true);
        const response = await axios.get(apiEndpoints, {
          params: {
            client_id: accesKey,
            page,
            per_page: perPage,
            query: searchWord,
          },
        });
        const newPhotos = response.data.results.filter((photo: Photo) => {
          return !popularPhotos.some((existingPhoto: Photo) => existingPhoto.id === photo.id);
        });

        setPopularPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
        setPage(prev => prev + 1);
        setLoading(false);
      } catch (error) {
        console.log("Images not found:", error);
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchWord(value);
  };

  return (
    <div>
      <h1>MainPage</h1>
      <Link to="/HistoryPage">Go to history page</Link>
      <div>
        <input
          type="text"
          value={searchWord}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div>
        {popularPhotos.map((image: Photo, index: number) => (
          <div key={`${image.id}-${index}`}>
            <img style={{ width: "200px" }} src={image.urls.full} alt={image.alt_description || "Image"} />
            <p>{image.id}</p>
          </div>
        ))}
      </div>
      <div ref={bottomOfPageRef} style={{ height: "10px" }}></div>
      {loading && <div>Loading more images...</div>}
    </div>
  );
};

export default SearchImage;
