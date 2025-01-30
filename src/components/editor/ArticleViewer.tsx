// @ts-nocheck
const ArticleViewer = ({ articleData }:Array<{text:string,image_url:string}>) => (
  <div className="w-full h-full bg-inherit rounded-md overflow-y-auto"> {/* Added overflow for scroll */}
    {articleData.map((item:{text:string,image_url:string}, index:number) => (
      <div key={index} className="bg-white text-slate-900 p-2 ">
        {item.image_url && <img src={item.image_url} alt={`Article Image ${index}`} className="w-full h-auto rounded-md border-2 border-slate-900" />}
        {item.text && <div className="prose p-4" dangerouslySetInnerHTML={{ __html: item.text }} />} {/* prose class for styling */}
      </div>
    ))}
  </div>
);

export default ArticleViewer
