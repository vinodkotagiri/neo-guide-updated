// @ts-nocheck
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ArticleMenu from './ArticleMenu';

const ArticleEditor = ({ articleData, onSave }) => {
  const [quillValue, setQuillValue] = useState('');
  const modules = {
    toolbar: { container: "#custom-toolbar" }, // Attach the toolbar outside
  };


  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "code-block",
    "list",
    "indent",
    "size",
    "header",
    "color",
    "background",
    "font",
    "align",
    "image",
  ];

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
  // const modules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'],
  //     ['blockquote', 'code-block'],
  //     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  //     [{ 'indent': '-1' }, { 'indent': '+1' }],
  //     [{ 'size': ['small', false, 'large', 'huge'] }],
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  //     [{ 'color': [] }, { 'background': [] }],
  //     [{ 'font': [] }],
  //     [{ 'align': [] }],
  //     ['link', 'image', 'video'], // Include image and video
  //     ['clean']
  //   ]
  // }
  return (
    <>
      <div className="flex bg-black rounded-md justify-between items-center">
        <div id="custom-toolbar">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />

          <button className="ql-code-block" />
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
          <select className="ql-size">
            <option value="small" />
            <option value={false} />
            <option value="large" />
            <option value="huge" />
          </select>
          <select className="ql-header">
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="4" />
            <option value="5" />
            <option value="6" />
            <option value="" />
          </select>
          <select className="ql-color" />
          <select className="ql-background" />
          <select className="ql-font" />
          <select className="ql-align" />

          <button className="ql-image" />
        </div>
        <ArticleMenu />
      </div>

      <div className=" w-full h-full bg-white text-slate-900 text-xl rounded-md overflow-y-auto relative p-3">
        {/* <div className='w-full text-right top-8 right-0  text-white z-50 sticky '>WELCOME</div> */}
        <ReactQuill theme="snow" value={quillValue} onChange={handleChange} formats={formats} modules={modules} />
        {/* <button onClick={handleSave} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button> */}
      </div>
    </>
  );
};

export default ArticleEditor;