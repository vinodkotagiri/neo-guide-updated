import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DocxViewer = ({docxUrl}:{docxUrl:string}) => {
  const [docxData, setDocxData] = useState(null);
  const [error, setError] = useState(null); // For error handling
  useEffect(() => {
    if (docxUrl) {
      axios.get(docxUrl,{
        headers: {
          'Access-Control-Allow-Origin': '*', // This header is generally set server-side, not client-side
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token',  // If you are sending authorization token
        },
      }).then((response) => {
        console.log(response)
      }).catch(error=>console.log(error))
    }
  }, [docxUrl]);
  return (
    <div className='w-full h-full p-2 border-2 border-slate-800 rounded-md'>

    </div>
  )
}

export default DocxViewer