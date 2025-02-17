import { setIsUploading } from '@/app/features/workingSlice';
import { AppDispatch, RootState } from '@/app/store';
import {  Dialog, DialogPanel  } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DragDropUpload from './DragDropUpload';

function UploadDialouge() {
  const { isUploading } = useSelector((state: RootState) => state.working)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <AnimatePresence>
      {isUploading && (
        <Dialog static open={isUploading} onClose={() => dispatch(setIsUploading(false))} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
          />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg space-y-4 bg-white p-12 rounded-md"
            >
              <DragDropUpload/>
              {/* <DialogTitle className="text-lg font-bold">Deactivate account</DialogTitle>
              <Description>This will permanently deactivate your account</Description>
              <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
              <div className="flex gap-4">
                <button onClick={() => dispatch(setIsUploading(false))}>Cancel</button>
                <button onClick={() => dispatch(setIsUploading(false))}>Deactivate</button>
              </div> */}
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
export default UploadDialouge;