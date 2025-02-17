import { setIsRecording } from "@/app/features/workingSlice"
import { AppDispatch, RootState } from "@/app/store"
import { Dialog, DialogPanel } from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useReactMediaRecorder } from "react-media-recorder"
import { useState } from "react"
import { FaStop, FaPlay } from "react-icons/fa"

function RecordDialouge() {
  const { isRecording } = useSelector((state: RootState) => state.working)
  const dispatch = useDispatch<AppDispatch>()
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({ video: true, audio: true })

  // Handle media permissions and start recording
  const handleStartRecording = async () => {
    try {
      // Request screen or tab capture
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }, // You can modify this based on user choice
        audio: true,
      })
      
      // Start recording after permissions are granted
      startRecording() // This will trigger the recording process
    } catch (err) {
      console.error("Permission denied or error while accessing media devices", err)
      alert("Please allow camera, microphone, and screen/tab access.")
    }
  }

  // Handle stop recording and reset
  const handleStopRecording = () => {
    console.log('mediaBlobUrl',mediaBlobUrl)
    stopRecording()
    // Clear the blob URL after stopping
    clearBlobUrl()
    // Optionally reset state for clean-up
    dispatch(setIsRecording(false))
  }

  return (
    <AnimatePresence>
      {isRecording && (
        <Dialog static open={isRecording} onClose={() => dispatch(setIsRecording(false))} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-6">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white p-8 rounded-xl shadow-xl"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700">{status}</p>
                </div>

                {/* Start/Stop Recording with Icons */}
                <div className="flex justify-center space-x-6 mt-4">
                  <motion.button
                    onClick={handleStartRecording}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay className="mr-2" />
                    Start Recording
                  </motion.button>
                  <motion.button
                    onClick={handleStopRecording}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaStop className="mr-2" />
                    Stop Recording
                  </motion.button>
                </div>

                {/* Video Preview */}
                {mediaBlobUrl && (
                  <div className="mt-4">
                    <motion.video
                      src={mediaBlobUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-lg shadow-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default RecordDialouge
