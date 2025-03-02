import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import 'react-timeline-range-slider/dist/styles.css'; // Import default styles

const VideoEditor = () => {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineData, setTimelineData] = useState([
    {
      id: '1',
      start: 0,
      end: 5,
      name: 'Clip 1',
      effects: [],
      roi: { x: 0, y: 0, width: 100, height: 100 }, // ROI for zooming
    },
    {
      id: '2',
      start: 5,
      end: 10,
      name: 'Clip 2',
      effects: [],
      roi: { x: 0, y: 0, width: 100, height: 100 },
    },
  ]);

  // Handle timeline changes (e.g., moving or resizing clips)
  const handleTimelineChange = (updatedClips) => {
    setTimelineData(updatedClips);
  };

  // Play/pause the video
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Seek to a specific time in the video
  const handleSeek = (time) => {
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time, 'seconds');
    }
  };

  // Add a new clip to the timeline
  const addClip = () => {
    const newClip = {
      id: String(timelineData.length + 1),
      start: timelineData[timelineData.length - 1].end,
      end: timelineData[timelineData.length - 1].end + 5,
      name: `Clip ${timelineData.length + 1}`,
      effects: [],
      roi: { x: 0, y: 0, width: 100, height: 100 },
    };
    setTimelineData([...timelineData, newClip]);
  };

  // Remove a clip from the timeline
  const removeClip = (id) => {
    setTimelineData(timelineData.filter((clip) => clip.id !== id));
  };

  // Trim a clip (adjust start and end times)
  const trimClip = (id, start, end) => {
    setTimelineData(
      timelineData.map((clip) =>
        clip.id === id ? { ...clip, start, end } : clip
      )
    );
  };

  // Update ROI (Region of Interest) for zooming
  const updateROI = (id, roi) => {
    setTimelineData(
      timelineData.map((clip) =>
        clip.id === id ? { ...clip, roi } : clip
      )
    );
  };

  // Apply effects to the video (simulated here)
  const applyEffect = (id, effect) => {
    setTimelineData(
      timelineData.map((clip) =>
        clip.id === id
          ? { ...clip, effects: [...clip.effects, effect] }
          : clip
      )
    );
  };

  return (
    <div className="video-editor-container">
      <h1>Video Editor</h1>

      {/* Video Player */}
      <div className="video-player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with your video URL
          playing={isPlaying}
          controls
          onProgress={(progress) => setCurrentTime(progress.playedSeconds)}
          width="100%"
          height="100%"
        />
      </div>

      {/* Play/Pause Button */}
      <button className="control-button" onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Timeline Editor */}
      <div className="timeline-wrapper">
        {/* <Timeline
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={timelineData[timelineData.length - 1].end}
          step={1}
        /> */}
      </div>

      {/* Add Clip Button */}
      <button className="control-button" onClick={addClip}>
        Add Clip
      </button>

      {/* Clip Controls */}
      <div className="clip-controls">
        {timelineData.map((clip) => (
          <div key={clip.id} className="clip-control">
            <span>{clip.name}</span>
            <button onClick={() => removeClip(clip.id)}>Remove</button>
            <button
              onClick={() => {
                trimClip(clip.id, clip.start + 1, clip.end - 1); // Example trim
              }}
            >
              Trim
            </button>
            <select
              onChange={(e) => applyEffect(clip.id, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Add Effect
              </option>
              <option value="fadeIn">Fade In</option>
              <option value="blur">Blur</option>
              <option value="blackAndWhite">Black & White</option>
            </select>
            <input
              type="range"
              min="0"
              max="100"
              value={clip.roi.width}
              onChange={(e) =>
                updateROI(clip.id, {
                  ...clip.roi,
                  width: parseInt(e.target.value),
                  height: parseInt(e.target.value),
                })
              }
            />
            <span>Zoom: {clip.roi.width}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoEditor;