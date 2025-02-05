//@ts-nocheck
import { Timeline, TimelineEffect, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { useEffect, useRef, useState } from "react";
import "./TimeLineEditor.css";

const TimeLineEditor = ({ duration, currentTime, onSeek }: { duration: number; currentTime: number; onSeek: (time: number) => void }) => {
  const timelineRef = useRef<TimelineState | null>(null);
  const [cursorTime, setCursorTime] = useState(currentTime);

  useEffect(() => {
    setCursorTime(currentTime); // ✅ Sync cursor with currentTime
  }, [currentTime]);

  const handleSeek = (time: number) => {
    setCursorTime(time);
    onSeek(time);
  };

  const mockData: TimelineRow[] = [
    {
      id: "0",
      actions: [
        {
          id: "action00",
          start: 0,
          end: duration ?? 2,
          disable: true,
          movable: false,
          flexible: false,
        },
      ],
    },
  ];

  const mockEffect: Record<string, TimelineEffect> = {};

  return (
    <Timeline
      ref={timelineRef} // ✅ Attach reference
      scale={1}
      style={{
        width: "100%",
        height: "180px",
        cursor: "pointer",
      }}
      editorData={mockData}
      effects={mockEffect}
      timeCursor={cursorTime} // ✅ Correct prop name
      onTimeCursorChange={handleSeek} // ✅ Update cursor on interaction
    />
  );
};

export default TimeLineEditor;
