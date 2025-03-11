import { useState, useEffect } from "react";
import image1 from "../../assets/imgs/slider/image1.png"
import image2 from "../../assets/imgs/slider/image2.png"
import image3 from "../../assets/imgs/slider/image3.png"

const LoginVisuals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [image1, image2, image3];
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full mt-20 md:w-3/5 flex flex-col items-center justify-center rounded-2xl m-3 bg-green-200 p-4 md:p-10 relative">
      <div className="overflow-hidden rounded-lg w-full max-w-sm md:max-w-lg relative">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-48 md:h-64 object-contain transition-transform duration-700 ease-in-out"
        />
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-3 bg-green-300 hover:bg-green-400 rounded-full"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-3 bg-green-300 hover:bg-green-400 rounded-full"
      >
        ❯
      </button>
      <p className="mt-6 mb-8 text-sm md:text-lg text-gray-700 text-center">
        Make your work easier and organized <br /> with  <span className="font-bold text-primary">TCMS App</span>
      </p>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-primary" : "bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};
export default LoginVisuals;
