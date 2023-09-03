import "./App.css";
import React, { Component, useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import CustomWebcam from "./CustomWebCam";
import ReactDOM from "react-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [showAllSaved, setShowAllSaved] = useState(false);

  const imagesListRef = ref(storage, "images/");
  const captureByCustomWebCam = (img) => {
    console.log(img);
    setImageUpload(img);
  };
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    if (showAllSaved) {
      setImageUrls([]);
      listAll(imagesListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageUrls((prev) => [...prev, url]);
          });
        });
      });
    }
  }, [showAllSaved]);

  return (
    <div className="App">
      <img
        src={process.env.REACT_APP_WEDDING_BG_IMAGE}
        className="memo-bg "
        alt="❤️"
      />
      <div className="bottom-menu">
        <div>
          <input
            type="file"
            className="memos-button"
            onChange={(event) => {
              console.log(event.target.files[0]);
              setImageUpload(event.target.files[0]);
            }}
          />
          {/**<CustomWebcam captureMethod={captureByCustomWebCam}></CustomWebcam>*/}{" "}
          <button onClick={uploadFile} className="memos-button">
            Foto Paylaş
          </button>
        </div>
        <div className="w100 grid-center">
          <button
            onClick={() => {
              setShowAllSaved(showAllSaved ? false : true);
            }}
            className="memos-button"
          >
            Paylaşımların Hepsini {showAllSaved ? "gizle" : "göster"}
          </button>
        </div>
      </div>
      <div className="memo-carousel">
        {showAllSaved && (
          <Carousel>
            {imageUrls.map((url) => {
              return <img height="100%" width="100%" key={v4()} src={url} />;
            })}
          </Carousel>
        )}
      </div>
    </div>
  );
}

export default App;
