//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import MP4Box from 'mp4box';

function ShapesLayer({ width, numSegments, thumbnailHeight, wrapperRef, playerRef }) {
  const { url } = useAppSelector((state) => state.video);
  const [videoDuration, setVideoDuration] = useState(0);
  const [segments, setSegments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const rectLayerRef = useRef(null);
  const { rectangles, blurs, spotLights, texts, arrows,zooms } = useAppSelector(state => state.elements)
  const sliceRef = useRef(null)
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
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
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
    <div className='w-full relative flex flex-col gap-1' style={{ width }} >
      {isLoading &&
        <div className="absolute inset-0 flex items-center justify-center">
          Loading...
        </div>}

      {/* Thumbnails section */}
      <div className='w-full flex justify-between bg-[#212025]' style={{ paddingTop: '30px' }}>
        {segments.map((segment, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            style={{
              width: `${100 / numSegments}%`,
            }}
            onClick={() => playerRef?.current?.seekTo(segment.start)}
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
            {/* <span className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-20 px-1 rounded">
                  {`${(Math.ceil(segment.start))}s`}
                </span> */}
          </div>
        ))}
      </div>

      {/* RECTANGLE LAYER */}
      <div className='h-[24px] w-full bg-[#212025] rounded-md  relative' ref={rectLayerRef}>
        {rectangles.map((rectangle) => {
          return (
            <DraggableResizableSlice playerRef={playerRef} wrapperRef={wrapperRef} layerRef={rectLayerRef} sliceRef={sliceRef} label={'rectangle'} key={rectangle.id} shapeType={'rectangle'} shape={rectangle} color='#3554af' />
          )
        })}
      </div>

      {/* BLUR LAYER */}
      <div className='h-[24px] w-full bg-[#212025] rounded-md relative' ref={rectLayerRef}>
        {blurs.map((blur) => {
          return (
            <DraggableResizableSlice playerRef={playerRef} wrapperRef={wrapperRef} layerRef={rectLayerRef} sliceRef={sliceRef} label={'blur'} key={blur.id} shapeType={'blur'} shape={blur} color='#f80093' />
          )
        })}
      </div>

      {/* ARROW LAYER */}
      <div className='h-[24px] w-full bg-[#212025] rounded-md relative' ref={rectLayerRef}>
        {arrows.map((arrow) => {
          return (
            <DraggableResizableSlice playerRef={playerRef} wrapperRef={wrapperRef} layerRef={rectLayerRef} sliceRef={sliceRef} label={'arrow'} key={arrow.id} shapeType={'arrow'} shape={arrow} color='#ffa101' />
          )
        })}
      </div>


      {/* TEXT LAYER */}
      <div className='h-[24px] w-full bg-[#212025] rounded-md relative' ref={rectLayerRef}>
        {texts.map((text) => {
          return (
            <DraggableResizableSlice playerRef={playerRef} wrapperRef={wrapperRef} layerRef={rectLayerRef} sliceRef={sliceRef} label={'text'} key={text.id} shapeType={'text'} shape={text} color='#01afec' />
          )
        })}
      </div>

      {/* SPOTLIGHT LAYER */}
      <div className='h-[24px] w-full bg-[#212025] rounded-md relative' ref={rectLayerRef}>
        {spotLights.map((spotlight) => {
          return (
            <DraggableResizableSlice playerRef={playerRef} wrapperRef={wrapperRef} layerRef={rectLayerRef} sliceRef={sliceRef} label={'spotlight'} key={spotlight.id} shapeType={'spotlight'} shape={spotlight} color='#fe4728' />
          )
        })}
      </div>
      <div className='h-[24px] w-full bg-[#212025] rounded-md relative' ref={rectLayerRef}>
        {zooms.map((zoom) => {
          return (
            <DraggableResizableSlice playerRef={playerRef} wrapperRef={wrapperRef} layerRef={rectLayerRef} sliceRef={sliceRef} label={'zoom'} key={zoom.id} shapeType={'zoom'} shape={zoom} color='#fef728' />
          )
        })}
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';
import DraggableResizableSlice from './DraggableResizableSlice';

ShapesLayer.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  numSegments: PropTypes.number,
  thumbnailHeight: PropTypes.number
};

export default ShapesLayer;