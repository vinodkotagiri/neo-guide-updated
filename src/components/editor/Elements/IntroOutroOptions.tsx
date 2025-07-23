import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIntroMedia, setOutroMedia } from '../../../redux/features/videoSlice';

const IntroOutroOptions = () => {
  const dispatch = useDispatch();
  const [introMedia, setIntroMediaState] = useState(null);
  const [outroMedia, setOutroMediaState] = useState(null);
  const [introPreview, setIntroPreview] = useState(null);
  const [outroPreview, setOutroPreview] = useState(null);

  const handleIntroChange = (e) => {
    const file = e.target.files[0];
    setIntroMediaState(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setIntroPreview(url);
      dispatch(setIntroMedia(url));
    } else {
      dispatch(setIntroMedia(null));
    }
  };

  const handleOutroChange = (e) => {
    const file = e.target.files[0];
    setOutroMediaState(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setOutroPreview(url);
      dispatch(setOutroMedia(url));
    } else {
      dispatch(setOutroMedia(null));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 text-white">
      <div>
        <h2 className="text-lg font-bold mb-2">Intro Media</h2>
        <input type="file" accept="video/*,image/*" onChange={handleIntroChange} />
        {introPreview && (
          <div className="mt-2">
            {introMedia && introMedia.type && introMedia.type.startsWith('video') ? (
              <video src={introPreview} controls width={200} />
            ) : (
              <img src={introPreview} alt="Intro Preview" width={200} />
            )}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Outro Media</h2>
        <input type="file" accept="video/*,image/*" onChange={handleOutroChange} />
        {outroPreview && (
          <div className="mt-2">
            {outroMedia && outroMedia.type && outroMedia.type.startsWith('video') ? (
              <video src={outroPreview} controls width={200} />
            ) : (
              <img src={outroPreview} alt="Outro Preview" width={200} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroOutroOptions; 