// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { generateGIF, getProgress } from "../../api/axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import toast from "react-hot-toast";
import { setLoader, setLoaderData } from "../../redux/features/loaderSlice";
import ArticleMenu from "./ArticleMenu";

const ArticleEditor = ({ articleData, onSave }) => {
  const [quillValue, setQuillValue] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, imageUrl: "" });
  const [requestId, setRequestId] = useState(null);
  const dispatch = useAppDispatch()
  const quillRef = useRef(null);
  const { url } = useAppSelector(state => state.video)
  const modules = {
    toolbar: { container: "#custom-toolbar" },
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

  function handleGenerateGIF(imageURL) {
    generateGIF({ reference_image_url: imageURL, video_url: url, gif_duration: 5 }).then(res => {
      if (res?.gif_url) {
        downloadImage(res?.gif_url, "article.gif")
      }
    })
  }

  const downloadImage = (imageUrl: string, fileName: string = "downloaded-image.gif") => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error("Error downloading image:", error));
  };

  useEffect(() => {
    if (requestId) {
      getArticleData(requestId)
    }
  }, [requestId])

  async function getArticleData(request_id) {
    if (request_id) {
      dispatch(setLoader({ loading: true }))
      const progessInterval = setInterval(() => {
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            const data = res?.result?.gif_url;
            if (data) {
              downloadImage(downloadImage);
            }
            dispatch(setLocked(false))
            dispatch(setLoader({ loading: false }))
          } else if (res?.status?.toLocaleLowerCase().includes('failed')) {
            clearInterval(progessInterval)
            dispatch(setLoader({ loading: false }))
            toast.error(res?.status)
          }
          else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        })
      }, 5000)
    }
  }


  useEffect(() => {
    if (articleData && articleData.length > 0) {
      const htmlArray = articleData
        .map((item, index) => {
          if (typeof item === "object" && item !== null && (item.text || item.image_url)) {
            const tempDiv = document.createElement("div");
            tempDiv.className = "bg-white text-slate-900 p-2";

            if (item.image_url) {
              const img = document.createElement("img");
              img.src = item.image_url;
              img.alt = `Article Image ${index}`;
              img.className = "w-full h-auto rounded-md border-2 border-slate-900";
              tempDiv.appendChild(img);
            }

            if (item.text) {
              const textDiv = document.createElement("div");
              textDiv.className = "prose p-4";
              textDiv.style.fontSize = "20px";
              textDiv.innerHTML = item.text;
              tempDiv.appendChild(textDiv);
            }
            return tempDiv.outerHTML;
          }
          return null;
        })
        .filter((item) => item !== null);

      setQuillValue(htmlArray.join(""));
    } else {
      setQuillValue("");
    }
  }, [articleData]);

  const handleChange = (value) => {
    setQuillValue(value);
  };

  const handleSave = () => {
    if (onSave) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(quillValue, "text/html");
      const updatedArticleData = [];

      const contentDivs = doc.querySelectorAll(".bg-white.text-slate-900.p-2");

      contentDivs.forEach((div) => {
        const img = div.querySelector("img");
        const textDiv = div.querySelector(".prose.p-4");

        updatedArticleData.push({
          image_url: img ? img.src : null,
          text: textDiv ? textDiv.innerHTML : null,
        });
      });

      onSave(updatedArticleData);
    }
  };

  // Handle Right Click on Image
  const handleContextMenu = (event) => {
    event.preventDefault();

    const img = event.target.closest("img");
    if (img) {
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        imageUrl: img.src,
      });
    } else {
      setContextMenu({ visible: false, x: 0, y: 0, imageUrl: "" });
    }
  };

  // Close Context Menu on Click Outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0, imageUrl: "" });
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor().container;
      editor.addEventListener("contextmenu", handleContextMenu);
      return () => editor.removeEventListener("contextmenu", handleContextMenu);
    }
  }, [quillRef]);

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

      <div className="w-full h-full bg-white text-slate-900 text-xl rounded-md overflow-y-auto relative">
        <ReactQuill ref={quillRef} theme="snow" value={quillValue} onChange={handleChange} formats={formats} modules={modules} />
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="absolute bg-white border border-gray-400 shadow-lg p-2 rounded-md"
          style={{ top: contextMenu.y, left: contextMenu.x, zIndex: 1000 }}
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleGenerateGIF(contextMenu.imageUrl)}
          >
            Generate GIF
          </button>
        </div>
      )}
    </>
  );
};

export default ArticleEditor;
