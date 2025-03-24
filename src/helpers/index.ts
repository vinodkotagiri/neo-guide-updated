
export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${Number(secs).toFixed(0)}`;
}

export function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function getSecondsFromTime(time) {
  const [hours, minutes, seconds] = time.split(":");
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}


