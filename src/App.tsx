import { useEffect, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAppDispatch } from './redux/hooks';
import { init, setVideoUrl, updateSubtitleData } from './redux/features/videoSlice';
import { setArticleData } from './redux/features/articleSlice';

// Lazy-loaded route components
const Editor = lazy(() => import('./views/Editor'));
const UploadView = lazy(() => import('./views/upload'));
const RecorderPage = lazy(() => import('./views/RecorderView'));

// Define types for localStorage data
interface ArticleData {
  text: string;
  image_url: string;
}

interface SubtitleData {
  start_time: string;
  end_time: string;
  text: string;
}

// Welcome component for the root route
const Welcome = () => (
  <main className="flex h-full items-center justify-center bg-neo-dark text-white text-2xl" aria-label="Welcome page">
    <h1>Welcome to Neo Guide</h1>
  </main>
);

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const url = localStorage.getItem('url');
      if (url) {
        dispatch(setVideoUrl(url));
      }

      const articleDataRaw = localStorage.getItem('articleData');
      if (articleDataRaw) {
        const articleData: ArticleData[] = JSON.parse(articleDataRaw);
        if (articleData?.length) {
          dispatch(setArticleData(articleData));
        }
      }

      const subtitlesRaw = localStorage.getItem('subtitles');
      if (subtitlesRaw) {
        const subtitles: SubtitleData[] = JSON.parse(subtitlesRaw);
        if (subtitles?.length) {
          dispatch(updateSubtitleData(subtitles));
        }
      }

      dispatch(init());
    } catch (error) {
      console.error('Failed to initialize from localStorage:', error);
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-screen">
      <Suspense fallback={<div className="flex h-full items-center justify-center text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/upload" element={<UploadView />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/recorder" element={<RecorderPage />} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'border-2 p-4 text-sm',
          style: { color: 'oklch(0.65 0.15 50)' }, // Custom color, add to tailwind.config.js
          success: {
            className: 'border-green-600 text-green-600',
          },
          error: {
            className: 'border-red-600 text-red-600',
          },
        }}
      />
    </div>
  );
};

export default App;