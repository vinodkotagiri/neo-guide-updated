// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ArticleMenu from './ArticleMenu';

const ArticleEditor = ({ articleData, onSave }) => {
  const [quillValue, setQuillValue] = useState('');
  const modules = {
    toolbar: { container: "#custom-toolbar" },
  };

  const formats = [
    "bold", "italic", "underline", "strike", "code-block",
    "list", "indent", "size", "header", "color", "background",
    "font", "align", "image",
  ];

  const quillRef = useRef(null);

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
            img.style.cursor = 'pointer';

            img.addEventListener('click', (e) => {
              e.preventDefault();
              const menu = document.createElement('div');
              menu.style.position = 'absolute';
              menu.style.top = `${e.clientY}px`;
              menu.style.left = `${e.clientX}px`;
              menu.style.backgroundColor = 'white';
              menu.style.border = '1px solid black';
              menu.style.padding = '5px';
              menu.style.zIndex = '1000';

              const gifButton = document.createElement('button');
              gifButton.textContent = 'Create GIF';
              gifButton.addEventListener('click', () => {
                console.log('Creating GIF from:', img.src);
                // Implement your GIF creation logic here (using a library)
                menu.remove();
              });
              menu.appendChild(gifButton);

              document.body.appendChild(menu);

              const handleClickOutside = (event) => {
                if (!menu.contains(event.target)) {
                  menu.remove();
                  document.removeEventListener('click', handleClickOutside);
                }
              };

              document.addEventListener('click', handleClickOutside);
            });

            img.addEventListener('contextmenu', (e) => {
              e.preventDefault(); // Prevent default context menu
              img.click(); // Trigger the regular click event
            });

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

      <div className="w-full h-full bg-white text-slate-900 text-xl rounded-md overflow-y-auto relative p-3">
        <ReactQuill theme="snow" value={quillValue} onChange={handleChange} formats={formats} modules={modules} ref={quillRef} />
      </div>
    </>
  );
};

export default ArticleEditor;