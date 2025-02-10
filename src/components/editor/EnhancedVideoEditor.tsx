//@ts-nocheck
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Timeline, TimelineRow, TimelineEffect } from "@xzdarcy/react-timeline-editor";
import "./TimeLineEditor.css";

interface Clip {
  id: string;
  start: number;
  end: number;
  name: string;
  roi?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const EnhancedVideoEditor = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clips, setClips] = useState<Clip[]>([
    {
      id: '1',
      start: 0,
      end: 5,
      name: 'Clip 1',
      roi: { x: 0, y: 0, width: 100, height: 100 },
    }
  ]);

  // Generate timeline data from clips
  const generateTimelineData = (): TimelineRow[] => {
    return [
      // Main video track
      {
        id: "video_track",
        name: "Video",
        actions: [
          {
            id: "main_video",
            start: 0,
            end: duration,
            disable: true,
            movable: false,
            flexible: false,
          }
        ],
      },
      // Clips track
      {
        id: "clips_track",
        name: "Clips",
        actions: clips.map(clip => ({
          id: clip.id,
          start: clip.start,
          end: clip.end,
          movable: true,
          flexible: true,
          name: clip.name,
        })),
      },
      // ROI/Zoom track
      {
        id: "zoom_track",
        name: "Zoom",
        actions: clips.map(clip => ({
          id: `zoom_${clip.id}`,
          start: clip.start,
          end: clip.end,
          movable: true,
          flexible: true,
          name: `Zoom ${clip.name}`,
          style: { backgroundColor: '#1E90FF' },
        })),
      },
    ];
  };

  // Handle timeline cursor change
  const handleTimelineChange = (time: number) => {
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  // Handle clip updates from timeline
  const handleTimelineUpdate = (rows: TimelineRow[]) => {
    const clipsTrack = rows.find(row => row.id === "clips_track");
    if (clipsTrack && clipsTrack.actions) {
      const updatedClips = clipsTrack.actions.map(action => ({
        id: action.id,
        start: action.start,
        end: action.end,
        name: action.name || 'Untitled Clip',
        roi: clips.find(c => c.id === action.id)?.roi || { x: 0, y: 0, width: 100, height: 100 },
      }));
      setClips(updatedClips);
    }
  };

  // Add new clip
  const addClip = () => {
    const lastClip = clips[clips.length - 1];
    const newClip: Clip = {
      id: `clip_${clips.length + 1}`,
      start: lastClip ? lastClip.end : 0,
      end: lastClip ? lastClip.end + 5 : 5,
      name: `Clip ${clips.length + 1}`,
      roi: { x: 0, y: 0, width: 100, height: 100 },
    };
    setClips([...clips, newClip]);
  };

  // Remove clip
  const removeClip = (id: string) => {
    setClips(clips.filter(clip => clip.id !== id));
  };

  // Update ROI for a clip
  const updateROI = (id: string, roi: { x: number; y: number; width: number; height: number }) => {
    setClips(clips.map(clip => 
      clip.id === id ? { ...clip, roi } : clip
    ));
  };

  return (
    <div className="flex flex-col h-full bg-black-op">
      {/* Video Player */}
      <div className="w-full h-[60%] bg-black">
        <ReactPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          width="100%"
          height="100%"
          playing={isPlaying}
          controls
          onDuration={setDuration}
          onProgress={(state) => setCurrentTime(state.playedSeconds)}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-4 bg-slate-900">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={addClip}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Clip
        </button>
      </div>

      {/* Timeline Editor */}
      <div className="w-full h-[30%] bg-slate-900">
        <Timeline
          scale={1}
          style={{
            width: "100%",
            height: "100%",
          }}
          editorData={generateTimelineData()}
          effects={{}}
          timeCursor={currentTime}
          onTimeCursorChange={handleTimelineChange}
          onChange={handleTimelineUpdate}
        />
      </div>

      {/* Clips and ROI Controls */}
      <div className="p-4 bg-slate-900 space-y-2 max-h-[20%] overflow-y-auto">
        {clips.map(clip => (
          <div
            key={clip.id}
            className="flex items-center gap-4 bg-slate-800 p-2 rounded"
          >
            <span className="text-white">{clip.name}</span>
            <span className="text-slate-400">
              {clip.start.toFixed(1)}s - {clip.end.toFixed(1)}s
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Zoom:</span>
              <input
                type="range"
                min="50"
                max="200"
                value={clip.roi?.width || 100}
                onChange={(e) =>
                  updateROI(clip.id, {
                    ...clip.roi!,
                    width: parseInt(e.target.value),
                    height: parseInt(e.target.value),
                  })
                }
                className="w-32"
              />
              <span className="text-slate-400 w-12">{clip.roi?.width}%</span>
            </div>
            <button
              onClick={() => removeClip(clip.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedVideoEditor;