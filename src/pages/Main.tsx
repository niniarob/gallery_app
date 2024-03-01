import React, { useEffect, useState, useCallback, useRef } from "react";
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

const MainPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchImage, setSearchImage] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  const accessKey = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";
  const perPage = 20;

  const fetchPhotos = useCallback(async () => {
    let url = `https://api.unsplash.com/photos`;
    let params: any = {
      client_id: accessKey,
      per_page: perPage,
      // order_by : "popular",
      page,
    };

    if (searchImage) {
      url = `https://api.unsplash.com/search/photos`;
      params.query = searchImage;
    }

    try {
      const response = await axios.get(url, { params });
      const data = searchImage ? response.data.results : response.data;
      setPhotos((prev) => (page === 1 ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [page, searchImage]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    const lastPhotoElement = document.querySelector(".photo:last-child");
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && photos.length >= perPage) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (lastPhotoElement) observer.current.observe(lastPhotoElement);

    return () => observer.current?.disconnect();
  }, [photos, searchImage]);

  const handleSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchImage(event.target.value);
    setPage(1); // Reset to the first page for a new search
    setPhotos([]); // Clear existing photos to ensure the UI is updated correctly
  };

  return (
    <div>
      <SearchBar searchImage={searchImage} handleSearchStringChange={handleSearchStringChange} />
      <div className="photos">
        {photos.map((photo, index) => (
          <motion.div
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            className="photo"
            key={`${photo.id}-${index}`}
          >
            <img
              src={photo.urls.regular}
              alt={photo.alt_description || "Photo"}
              style={{ width: "270px", height: "170px", borderRadius: "15px", objectFit: "cover" }}
            />
          </motion.div>
        ))}
      </div>
      <div id="observer-sentinel" />
    </div>
  );
};

export default MainPage;
