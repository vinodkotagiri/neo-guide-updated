import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const DragDropUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]); // Only keep the latest file
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false, // Accept only a single file
    noClick: true,    // Prevent clicking the drop zone itself
    noKeyboard: true, // Disable keyboard file selection
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-lg">
      {/* Drag & Drop Area */}
      <motion.div
        {...getRootProps()}
        className="w-full p-10 text-center bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <input {...getInputProps()} />
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Drag & drop a file here or
        </motion.p>
        <motion.button
          type="button"
          onClick={open}
          className="mt-2 px-4 py-2 cursor-pointer text-blue-600 outline-0 rounded-lg  transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCloudUploadAlt size={36} />
        </motion.button>
      </motion.div>

      {/* Display Selected File */}
      {file && (
        <motion.div
          className="mt-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold">Selected File:</h3>
          <p className="mt-2 text-gray-700">
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DragDropUpload;
