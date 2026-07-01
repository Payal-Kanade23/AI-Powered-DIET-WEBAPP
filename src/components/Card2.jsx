import React from "react";

function Card2({ imgSrc, title, desc , link}) {
  return (
    <div className="flex w-full h-[200px] overflow-hidden">

      {/* IMAGE */}
      <img
        src={imgSrc}
        className="w-[220px] h-full object-cover flex-shrink-0"
        onClick={()=>{window.open(link,"_blank")}
          
        }
      />

      {/* CONTENT */}
      <div className="flex flex-col justify-center px-5 flex-1">
        <h1 className="font-bold text-blue-900 text-lg mb-2">
          {title}
        </h1>
        <p className="text-blue-900 text-sm line-clamp-4">
          {desc}
        </p>
      </div>

    </div>
  );
}

export default Card2;