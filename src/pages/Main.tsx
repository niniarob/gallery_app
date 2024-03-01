import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import "../styles/Main.css";

interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  alt_description?: string;
}

const MainPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const perPage = 20;
  const accessKey = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";

  const fetchPopularPhotos = useCallback(async () => {
    try {
      const response = await axios.get("https://api.unsplash.com/photos", {
        params: {
          client_id: accessKey,
          per_page: perPage,
          page: page,
          order_by: "popular",
        },
      });

      setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [accessKey, page]);

  useEffect(() => {
    fetchPopularPhotos();
  }, [fetchPopularPhotos]);

  const observeBottom = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    },
    [setPage]
  );

  useEffect(() => {
    const lastPhotoElement = document.querySelector(
      ".photo:last-child"
    ) as HTMLElement | null;
    observeBottom(lastPhotoElement);

    return () => {
      if (lastPhotoElement) {
        observeBottom(lastPhotoElement);
      }
    };
  }, [observeBottom, photos]);

  return (
    <div>
      <SearchBar />
      <div className="photos">
        {/* <h2>Popular Photos</h2> */}
        {photos.map((photo: Photo, index: number) => (
          <div className="photo" key={`${photo.id}-${index}`}>
            <img
              style={{ width: "200px", borderRadius: "20px" }}
              src={photo.urls.regular}
              alt={photo.alt_description || "Photo"}
            />
            <p>{photo.id}</p>
          </div>
        ))}
      </div>
      <div id="bottom" />
    </div>
  );
};

export default MainPage;
