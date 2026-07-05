import React from 'react';
import { motion } from 'framer-motion';
import h6 from "../assets/TheMindDiet_1200x675.jpg"
import n1 from "../assets/pexels-noemiji-23524542.jpg.webp"
import n2 from "../assets/BrainDiet.webp"
import n3 from "../assets/images.jpg"
import n4 from "../assets/images (1).jpg"
import n5 from "../assets/diet-weight-loss-header.jpg"
import Card from '../components/Card';
function Home() {

  const itemVariants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};
  const data = [
    { id:1, 
      mediaType:"image",
        mediaSrc:n1,
        badge:"Research",
        title:"New Coordinated Research Project",
        description:"IAEA Launches New Research Project on Dietary Protein Quality and Requirements",
        link:"https://www.iaea.org/newscenter/news/iaea-launches-new-research-project-on-dietary-protein-quality-and-requirements"
        
},
    { id:2,
      mediaType:"image",
        mediaSrc:n2,
        badge:"Food",
        link:"https://www.sciencealert.com/the-best-diet-for-brain-health-is-probably-not-what-you-think",
        description:"The Best Diet For Brain Health Is Probably Not What You Think"
        
    },
     { id:3,
       mediaType:"image",
        mediaSrc:n3,
        badge:"Nutrition",
        description:"Nutritionist Explains Why Rice Can Be Part Of A Healthy, Balanced Diet",
        link:"https://www.ndtv.com/health/healthy-diet/nutritionist-explains-why-rice-can-be-part-of-a-healthy-balanced-diet-11667096"

    },
    {
      id:4,
       mediaType:"image",
        mediaSrc:n4,
        badge:"health",
        description:"Sodium deficiency is extremely unlikely in healthy individuals.",
        link:"https://www.who.int/news-room/fact-sheets/detail/sodium-reduction"
    },
    {
      id:5,
       mediaType:"image",
        mediaSrc:n5,
        badge:"Lifestyle",
        description:"Eating at the right time is important for health, UTSW study shows",
        link:"https://www.utsouthwestern.edu/newsroom/articles/year-2026/june-health-eat.html"

    }
  ]

  const data2=[
    
       { id:1, 
      mediaType:"video",
        mediaSrc:"https://www.youtube.com/embed/QVgeB5iWcBc",
        title:"New Coordinated Research Project",
        description:"Wellness begins with what’s on your plate",
        
},
    { id:2,
      mediaType:"video",
        mediaSrc:"https://www.youtube.com/embed/xyQY8a-ng6g",
        description:"Fuel your body, not just your cravings. "
        
    },
     { id:3,
       mediaType:"video",
        mediaSrc:"https://www.youtube.com/embed/P7yM0TKvUm4",
        description:"Is it possible to lose weight fast— in a healthy way? Dig into how different forms of dieting affect your body.",
      

    },
    {
      id:4,
       mediaType:"video",
        mediaSrc:"https://www.youtube.com/embed/xi-zHJL5bnI",
        description:"Calories count, but balance matters more.",
    },
    
  ]
  return (
    <div>
      

      <div className='flex flex-col '>
              <div>
              <img src={h6} alt="doctor" className='w-full h-124 object-cover'></img>
                          
    </div>
          
     <div className='flex justify-center mt-15'> 
        <div className='max-w-6xl px-6 space-y-10 '>
           <div className='flex justify-center items-center '> <h1 className='text-3xl text-green-600 font-bold'>"Healthy Facts You Can't Miss!"</h1></div>
       <p className='text-justify text-lg leading-8 '>Healthy eating is the foundation of a strong and active lifestyle. A balanced diet provides your body with essential nutrients such as carbohydrates, proteins, healthy fats, vitamins, and minerals that support overall growth, energy, and immunity. Choosing the right foods in the right proportions helps maintain a healthy weight and reduces the risk of lifestyle-related diseases.
        </p>
       <p className='text-justify text-lg leading-8'>A proper diet is not about strict restrictions or skipping meals, but about making smarter food choices every day. Including fresh fruits, vegetables, whole grains, and adequate hydration can significantly improve physical and mental well-being. Consistency and moderation are key factors in building long-term healthy eating habits that are both sustainable and enjoyable.
</p>
       <p className='text-justify text-lg leading-8'>At our platform, we aim to guide you toward a healthier lifestyle by providing simple, practical, and effective diet advice. Whether your goal is weight loss, muscle gain, or overall wellness, we help you make informed decisions that fit your personal needs. Small changes in your daily diet can lead to big improvements in your health and quality of life.
</p> 
</div>

      </div>
    <div className='flex justify-center mt-15'>
        <div className='max-w-6xl px-6 space-y-10 marker:text-green-600'>
                <motion.ul
  className="list-disc space-y-4 marker:text-green-600 max-w-6xl px-6"
  initial="hidden"
  variants={listVariants}
  whileInView="visible"
  viewport={{ once: false, amount: 0.2 }}>
    <motion.li
    variants={itemVariants}
    transition={{ delay: 0.1 }}
    className="text-justify text-lg leading-8">Your body needs a balanced combination of nutrients every day to function properly. No single food can provide everything, which is why a varied diet including fruits, vegetables, whole grains, protein, and healthy fats is essential for long-term health and energy. 
             </motion.li>
             <motion.li
    variants={itemVariants}
    transition={{ delay: 0.1 }}
     className='text-justify text-lg leading-8'>Drinking enough water is just as important as eating healthy food. Staying hydrated helps improve digestion, supports brain function, boosts metabolism, and keeps your skin healthy. Even mild dehydration can affect your focus, mood, and physical performance.
      </motion.li>
            <motion.li
    variants={itemVariants}
    transition={{ delay: 0.1 }}
     className='text-justify text-lg leading-8'>Regular physical activity combined with a healthy diet is one of the most effective ways to prevent lifestyle diseases such as obesity, diabetes, and heart problems. Small daily habits like walking, avoiding processed foods, and eating home-cooked meals can make a big difference over time.
        </motion.li>

       </motion.ul>
      </div>
    </div>

    <div>
      <div className='flex justify-center items-center'>
        <h1 className='text-3xl text-green-600 font-bold p-5'>News</h1>
      </div>
      <div className='w-full overflow-hidden '>
        <div className='flex w-max gap-4 animate-scroll'>
    {
      data.concat(data).map((i , index)=>(
        <Card key={index} {...i} />
      ))
    }
        </div>
        
      
      
      </div>
    </div>


     <div className='flex flex-col justify-center items-center '>
      <div className=' flex justify-center items-center'>
        <h1 className=' text-3xl text-green-600 font-bold p-5'>Videos</h1>
      </div>
        <div className='flex flex-wrap justify-around  max-w-6xl gap-5 space-y-10'>
    {
      data2.map((i , index)=>(
        <iframe key={index} 
           src={i.mediaSrc}
        className="w-[500px] h-[300px] rounded-xl"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`video-${i.description}`}
        />
      ))
    }
        </div>
        
      
      
      </div>
    
      
      
          </div> 
    </div>
  );
}

export default Home;
