import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import "../styles/Main.css";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

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
  const [searchImage, setSearchImage] = useState<string>("");

  const accessKey = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";
  const perPage = 20;

  const fetchPopularPhotos = useCallback(async () => {
    try {
      const response = await axios.get("https://api.unsplash.com/photos", {
        params: {
          client_id: accessKey,
          per_page: perPage,
          page: page,
          order_by: "popular",
          query: searchImage,
        },
      });
      console.log(response);
      setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [accessKey, page, searchImage]);

  useEffect(() => {
    fetchPopularPhotos();
    setPhotos([]);
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

  const handleSearchStringChange = (event: any) => {
    setSearchImage(event.target.value);
  };

  return (
    <div>
      <SearchBar
        searchImage={searchImage}
        handleSearchStringChange={handleSearchStringChange}
      />
      <div className="photos">
        {photos.map((photo: Photo, index: number) => (
          <motion.div
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView={"show"}
            // viewport={{ once: false, amount: 0.7 }}
            className="photo"
            key={`${photo.id}-${index}`}
          >
            <img
              style={{
                width: "270px",
                height: "170px",
                borderRadius: "15px",
                objectFit: "cover",
              }}
              src={photo.urls.regular}
              alt={photo.alt_description || "Photo"}
            />
            {/* <p>{photo.id}</p> */}
          </motion.div>
        ))}
      </div>
      <div id="bottom" />
    </div>
  );
};

export default MainPage;
