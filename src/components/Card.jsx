import React from 'react';


    const Card = ({
        mediaType = 'image',
        mediaSrc,
        badge,
        title="image",
        description,
        link,
        actionText = 'Explore More'
    }) =>{ 

    
  return (
    <div className=' relative w-[250px] h-[400px] flex flex-col flex-shrink-0 bg-white rounded-xl shadow-md p-4'>
     
       
            <img
            src={mediaSrc}
            alt={title}
            className='w-full h-[200px] object-cover rounded-md'
            />
        
        {
            <div className='flex-1'>
                <p className='text-gray-500 lowercase mt-2  '>{description}</p>
            </div>
        }

        {badge && (
            <span className='absolute top-5 left-5 bg-green-500 text-xs font-semibold uppercase rounded-xl shadow-sm px-2 py-1'>
                {badge}
            </span>
        )}

        {link && <button
        onClick={() => window.open(link, "_blank", "noopener,noreferrer")} 
        className="w-full mt-4  bg-gray-900 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
          {actionText}
        </button>}
      </div>
        


    
  );
}


export default Card;
