import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import MP4Box from 'mp4box';

function ShapesLayer({ width, numSegments, thumbnailHeight }) {
  const { url } = useAppSelector((state) => state.video);
  const [videoDuration, setVideoDuration] = useState(0);
  const [segments, setSegments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate thumbnail using canvas
  const generateThumbnail = (video, time) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      video.currentTime = time;

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  // Process video with MP4Box and create segments
  const processVideoWithMP4Box = async (videoUrl) => {
    setIsLoading(true);
    try {
      const response = await fetch(videoUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      const mp4boxfile = MP4Box.createFile();
      arrayBuffer.fileStart = 0;
      
      mp4boxfile.onReady = async (info) => {
        const duration = info.duration / info.timescale;
        setVideoDuration(duration);

        const segmentLength = duration / numSegments;
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.crossOrigin = 'anonymous';

        const newSegments = [];
        for (let i = 0; i < numSegments; i++) {
          const start = segmentLength * i;
          const midPoint = start + segmentLength / 2;
          const thumbnail = await generateThumbnail(videoElement, midPoint);
          
          newSegments.push({
            start,
            end: start + segmentLength,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            thumbnail
          });
        }
        
        setSegments(newSegments);
        setIsLoading(false);
      };

      mp4boxfile.onError = (error) => {
        console.error('MP4Box error:', error);
        setIsLoading(false);
      };

      mp4boxfile.appendBuffer(arrayBuffer);
      mp4boxfile.flush();
    } catch (error) {
      console.error('Error processing video:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      processVideoWithMP4Box(url);
    }
  }, [url, numSegments]);

  return (
    <div className='w-full relative' style={{ width }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          Loading...
        </div>
      )}
      
      {/* 48px height segment bar */}
     
      
      {/* Thumbnails section */}
      <div className='w-full flex justify-between pt-14' style={{ paddingTop: '56px' }}>
        {segments.map((segment, index) => (
          <div
            key={index}
            className="relative"
            style={{
              width: `${100 / numSegments}%`,
            }}
          >
            {segment.thumbnail && (
              <img
                src={segment.thumbnail}
                alt={`Segment ${index + 1}`}
                style={{
                  width: '100%',
                  height: thumbnailHeight,
                  objectFit: 'cover',
                  border: '2px solid white',
                  borderRadius: '4px'
                }}
              />
            )}
            <span className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-1 rounded">
              {`${segment.start.toFixed(1)}s`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';

ShapesLayer.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  numSegments: PropTypes.number,
  thumbnailHeight: PropTypes.number
};

export default ShapesLayer;