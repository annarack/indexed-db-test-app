import "./App.css";
import { del, get, set } from "idb-keyval";
import { useEffect, useRef, useState } from "react";

export default function ImageUpload(props) {
  const [imageURL, setImageURL] = useState();
  const [image, setImage] = useState();

  // on app start get image object from local storage and get its URL
  useEffect(() => {
    get(props.imgID).then((val) => {
      if (val) {
        var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(val);
        setImageURL(imgURL);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      set(props.imgID, image)
        .then(() => console.log("Image is saved"))
        .catch((err) => console.log("Saving image failed!", err));
    }
  };

  const showImage = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      let reader = new FileReader();
      //reader.onload is fired when url from reader.readAsDataURL is available
      reader.onload = function () {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const deleteImage = () => {
    setImageURL();
    del(props.imgID);
  };

  return (
    <div className="ImgUploadContainer">
      {imageURL && (
        <div className="ImageContainer">
          <img className="Image" src={imageURL} alt=""></img>
        </div>
      )}
      <form className="ImgUpload" onSubmit={handleSubmit}>
        <label>
          Choose image:
          <input type="file" onChange={showImage} />
        </label>
        <br />
        <br />
        <button type="submit">Save to local storage</button>
        <button onClick={deleteImage}>Delete image</button>
      </form>
    </div>
  );
}
