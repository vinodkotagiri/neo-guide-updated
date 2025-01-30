// @ts-nocheck
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ArticleEditor = ({ articleData, onSave }) => {
  const [quillValue, setQuillValue] = useState('');
  
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'], // Include image and video
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  useEffect(() => {
    if (articleData && articleData.length > 0) {
      const htmlArray = articleData.map((item, index) => {
        if (typeof item === 'object' && item !== null && (item.text || item.image_url)) {
          const tempDiv = document.createElement('div');
          tempDiv.className = "bg-white text-slate-900 p-2";

          if (item.image_url) {
            const img = document.createElement('img');
            img.src = item.image_url;
            img.alt = `Article Image ${index}`;
            img.className = "w-full h-auto rounded-md border-2 border-slate-900";
            tempDiv.appendChild(img);
          }

          if (item.text) {
            const textDiv = document.createElement('div');
            textDiv.className = "prose p-4";
            textDiv.style.fontSize = '20px';
            textDiv.innerHTML = item.text;
            tempDiv.appendChild(textDiv);
          }
          return tempDiv.outerHTML;
        }
        return null;
      }).filter(item => item !== null);

      setQuillValue(htmlArray.join(''));
    } else {
      setQuillValue('');
    }
  }, [articleData]);

  const handleChange = (value) => {
    setQuillValue(value);
  };

  const handleSave = () => {
    if (onSave) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(quillValue, 'text/html');
      const updatedArticleData = [];

      const contentDivs = doc.querySelectorAll('.bg-white.text-slate-900.p-2');

      contentDivs.forEach((div) => {
        const img = div.querySelector('img');
        const textDiv = div.querySelector('.prose.p-4');
        

        updatedArticleData.push({
          image_url: img ? img.src : null,
          text: textDiv ? textDiv.innerHTML : null,
        });
      });

      onSave(updatedArticleData);
    }
  };

  return (
    <div className=" w-full h-full bg-white text-slate-900 text-xl rounded-md overflow-y-auto">
      <ReactQuill theme="snow" value={quillValue} onChange={handleChange} formats={formats} modules={modules}/>
      <button onClick={handleSave} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button>
    </div>
  );
};

export default ArticleEditor;