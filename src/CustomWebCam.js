import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react"; // import useState

const CustomWebcam = ({ captureMethod }) => {
  const webcamRef = useRef(null); // create a webcam reference
  const [imgSrc, setImgSrc] = useState(null); // initialize it
  const contentType = "image/jpeg";
  // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const imageBlob = prepareForUpload(imageSrc);
    setImgSrc(imageSrc);
    captureMethod(imageBlob);
  }, [webcamRef]);

  const prepareForUpload = (base64Image) => {
    const imageSrcSplitted = base64Image.split(/,(.+)/)[1];

    const byteCharacters = atob(imageSrcSplitted);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return blob;
  };
  const retake = () => {
    setImgSrc(null);
  };

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam
          height={600}
          width={600}
          ref={webcamRef}
          screenshotFormat={contentType}
        />
      )}
      <div className="btn-container">
        {imgSrc ? (
          <button onClick={retake}>Retake photo</button>
        ) : (
          <button onClick={capture}>Capture photo</button>
        )}
      </div>
    </div>
  );
};

export default CustomWebcam;
