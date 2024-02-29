// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// interface Photo {
//   id: string;
//   urls: {
//     full: string;
//   };
//   alt_description?: string;
// }

// const MainPage: React.FC = () => {
//   const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const accesKey: string = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";
//   const apiAndpoints: string = `https://api.unsplash.com/photos`;
//   const fetchImages = async () => {
//     try {
//       const response = await axios.get(apiAndpoints, {
//         params: {
//           client_id: accesKey,
//           page: page, // ფეიჯები იმატებს
//           per_page: 20,
//           order_by: "popular",
//         },
//       });
//       setPopularPhotos(response.data);
//     } catch (error) {
//       console.log("images doesnot find:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>MainPage</h1>

//       <Link to="/HistoryPage"> go history page</Link>

//       <div>
//         {popularPhotos.map((image: Photo) => (
//           <img
//             style={{ width: "200px" }}
//             src={image.urls.full}
//             alt={image.alt_description || "Image"}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
// export default MainPage;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// interface Photo {
//   id: string;
//   urls: {
//     full: string;
//   };
//   alt_description?: string;
// }

// const MainPage: React.FC = () => {
//   const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const accesKey: string = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";
//   const apiAndpoints: string = `https://api.unsplash.com/photos`;

//   useEffect(() => {
//     fetchImages();
//   }, [page]); // Fetch images when page changes

//   const fetchImages = async () => {
//     try {
//       const response = await axios.get(apiAndpoints, {
//         params: {
//           client_id: accesKey,
//           page: page,
//           per_page: 20,
//           //   order_by: "popular",
//         },
//       });
//       // Concatenate new images with existing ones for pagination
//       setPopularPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
//     } catch (error) {
//       console.log("Images not found:", error);
//     }
//   };

//   const loadMoreImages = () => {
//     setPage((prevPage) => prevPage + 1); // Increment page count
//   };

//   return (
//     <div>
//       <h1>MainPage</h1>

//       <Link to="/HistoryPage">Go to history page</Link>

//       <div>
//         {popularPhotos.map((image: Photo) => (
//           <img
//             key={image.id} // Add key prop for list items
//             style={{ width: "200px" }}
//             src={image.urls.full}
//             alt={image.alt_description || "Image"}
//           />
//         ))}
//       </div>

//       <button onClick={loadMoreImages}>Load More</button>
//     </div>
//   );
// };

// export default MainPage;

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

const MainPage: React.FC = () => {
  const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const accesKey: string = "E9JfPfaxSNELMSbFUyTtXNZ7-RqOXtxMPULaFS0BgQo";
  const apiAndpoints: string = `https://api.unsplash.com/photos`;
  const perPage: number = 20;

  // Ref for the bottom of the page
  const bottomOfPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchImages();
  }, []); // Fetch images when component mounts

  // Fetch images when scrolling to the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (
        bottomOfPageRef.current &&
        window.innerHeight + window.scrollY >= bottomOfPageRef.current.offsetTop
      ) {
        loadMoreImages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [popularPhotos]); // Add popularPhotos to dependencies to avoid re-attaching scroll event listener on every render

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiAndpoints, {
        params: {
          client_id: accesKey,
          page: page,
          per_page: perPage,
          order_by: "popular",
        },
      });
      console.log(response);
      setPopularPhotos(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Images not found:", error);
    }
  };

  const loadMoreImages = async () => {
    if (!loading) {
      try {
        setLoading(true);
        const nextPage = page + 1;
        const response = await axios.get(apiAndpoints, {
          params: {
            client_id: accesKey,
            page: page,
            per_page: perPage,
            order_by: "popular",
          },
        });
        const newPhotos = response.data.filter((photo: Photo) => {
          return !popularPhotos.some(
            (existingPhoto: Photo) => existingPhoto.id === photo.id
          );
        });

        setPopularPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setPage(nextPage);
        setLoading(false);
      } catch (error) {
        console.log("Images not found:", error);
      }
    }
  };

  return (
    <div>
      <h1>MainPage</h1>

      <Link to="/HistoryPage">Go to history page</Link>

      <div>
        {popularPhotos.map((image: Photo) => (
          <div key={image.id}>
            <img style={{ width: "200px" }} src={image.urls.full} alt="/" />
            <p> {image.id}</p>
          </div>
        ))}
      </div>

      <div ref={bottomOfPageRef} style={{ height: "10px" }}></div>
    </div>
  );
};

export default MainPage;
