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

const MainPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);

  const [searchImage, setSearchImage] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  const accessKey = "FHTOTHxdVdMLh4vGl2cNmYrKFi_KWQ7oLtfgL38D2lY";
  const perPage = 20;
  const fetchPopularPhotos = useCallback(async () => {
    let url = `https://api.unsplash.com/photos`;
    let params: any = {
      client_id: accessKey,
      per_page: perPage,
      order_by: "popular",
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
      console.log(response);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [page, searchImage]);

  useEffect(() => {
    fetchPopularPhotos();
  }, [fetchPopularPhotos]);

  // const observeBottom = useCallback(
  //   (node: HTMLElement | null) => {
  //     if (!node) return;

  //     const observer = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         setPage((prevPage) => prevPage + 1);
  //       }
  //     });

  //     observer.observe(node);

  //     return () => {
  //       observer.disconnect();
  //     };
  //   },
  //   [setPage]
  // );

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

  const handleSearchStringChange = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchPopularPhotos();
      // setPage(1);
      // setPhotos([]);
    } else {
      setSearchImage(event.currentTarget.value);
      setPage(1);
      setPhotos([]);
    }
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
            viewport={{ once: false, amount: 0.7 }}
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
