import React from "react";
import mal from "../assets/mal.jpg";
import anemia from "../assets/anemia.webp";
import obesity from "../assets/o.jpg";
import db from "../assets/db.png";
import asthma from "../assets/asthma.webp";
import cancer from "../assets/cancer.jpg";
import Card2 from "../components/Card2";
import heart from "../assets/heart.jpg"
import liver from "../assets/liver.png"
import { motion } from "framer-motion";

function Topic() {
  const diseases = [
  { img: db, title: "Diabetes" },
  { img: anemia, title: "Anemia" },
  { img: obesity, title: "Obesity" },
  { img: mal, title: "Malnutrition" },
  { img: asthma, title: "Asthma" },
  { img: cancer, title: "Cancer"},
  {img : heart , title:"Heart"},
  {img: liver , title:"Liver"}
];
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 pt-20 ">
     <h1 className="text-4xl font-bold text-center mb-10 text-green-600" >Explore By Issues</h1>
      {/* TOP IMAGE GRID */}
      <div className="flex justify-center ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-20 p-6 max-w-6xl">

          {diseases.map((i, index) => (
            <div className="flex flex-col justify-center items-center ">
                <img
              key={index}
              src={i.img}
              className="h-[150px] w-[150px] rounded-full object-cover border-4 border-white shadow-md hover:scale-110 transition duration-300"
            />
            <h1 className="text-sm text-green-600 p-5">{i.title}</h1>
              </div>
          
          ))}
        </div>
      </div>

      {/* CARDS SECTION */}
      <motion.div
      initial={{opacity: 0 , y:30}}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      whileInView={{opacity:1 , y:0}}
      transition={{duration:0.6 , ease:"easeOut"}}

      className="flex flex-col items-center gap-8 mt-16 px-4 ">

        <div className="w-full max-w-4xl border border-blue-900 hover:border-green-800 hover:scale-110 transition duration-300 hover:shadow-2xl">
          <Card2
            imgSrc="https://lirp.cdn-website.com/edb14da3/dms3rep/multi/opt/Eixo+Cerebro-Intestino+Impacto+no+Aparelho+Digestivo-640w.jpg"
            title="From Gut to Brain"
            link="https://www.who.int/podcasts/episode/science-in-5/episode-144-little-lungs-big-risks-the-rsv-threat-to-infants"
            desc="A worm that can cause epilepsy? Meet Taenia solium — the pig tapeworm that travels from gut to brain, causing seizures and preventable epilepsy in millions. In this episode of Science in 5, Dr Bernadette Abela explains how this parasite spreads when pigs eat human feces and humans consume contaminated food or water — and what we can do to stop it. Learn how cooking meat properly, improving hygiene, and vaccinating pigs can break the cycle."
          />
        </div>

        <div className="w-full max-w-4xl border border-blue-900 hover:border-green-800 hover:scale-110 transition duration-300 hover:shadow-2xl">
          <Card2
          
            imgSrc="https://thumbs.dreamstime.com/b/rsv-icon-respiratory-syncytial-virus-isolated-background-vector-illustration-381702420.jpg"
            title="Respiratory Syncytial Virus"
            link="https://www.who.int/podcasts/episode/science-in-5/episode--145---pig-tapeworm-and-epilepsy"
            desc="Did you know that respiratory syncytial virus (RSV) is the leading cause of infant hospitalizations worldwide? Each year it claims over 100 000 young lives. In this Science in 5 episode, WHO’s Dr Daniel Feikin shares how new immunization options can protect your baby."
          />
        </div>

        <div className="w-full max-w-4xl border border-blue-900 hover:border-green-800 hover:scale-110 transition duration-300 hover:shadow-2xl">
          <Card2
            imgSrc="https://www.metropolisindia.com/upgrade/blog/upload/24/02/Everything_you_need_to_know_about_Cholera1707909522.webp"
            title="Air Pollution & Brain Health"
            link="https://www.who.int/podcasts/episode/science-in-5/episode--141---air-pollution-damages-young-brains"
            desc="Did you know that the air you breathe can harm your brain, and increase your risk for dementia, anxiety and depression ? Nine out of 10 people around the world breathe air that does not meet WHO’s recommended air quality standards. Air pollution kills 7 million people every year. What are cities like London, Bogotá and Beijing doing to clean their air? Dr Maria Neira explains in Science in 5."
          />
        </div>

      </motion.div>
    </div>
  );
}

export default Topic;