import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import mal from "../assets/mal.jpg";
import anemia from "../assets/anemia.webp";
import obesity from "../assets/o.jpg";
import db from "../assets/db.png";
import asthma from "../assets/asthma.webp";
import cancer from "../assets/cancer.jpg";
import heart from "../assets/heart.jpg";
import liver from "../assets/liver.png";
import Card2 from "../components/Card2";

const diseases = [
  { img: db, title: "Diabetes", description: "Understand blood sugar and food choices." },
  { img: anemia, title: "Anemia", description: "Learn about iron-rich nutrition." },
  { img: obesity, title: "Obesity", description: "Build sustainable healthy habits." },
  { img: mal, title: "Malnutrition", description: "Explore balanced nourishment." },
  { img: asthma, title: "Asthma", description: "Find wellness and prevention tips." },
  { img: cancer, title: "Cancer", description: "Discover supportive health guidance." },
  { img: heart, title: "Heart Health", description: "Care for your cardiovascular health." },
  { img: liver, title: "Liver Health", description: "Support a healthier liver." },
];

const articles = [
  {
    imgSrc:
      "https://lirp.cdn-website.com/edb14da3/dms3rep/multi/opt/Eixo+Cerebro-Intestino+Impacto+no+Aparelho+Digestivo-640w.jpg",
    title: "From Gut to Brain",
    link:
      "https://www.who.int/podcasts/episode/science-in-5/episode--145---pig-tapeworm-and-epilepsy",
    desc:
      "A worm that can cause epilepsy? Meet Taenia solium — the pig tapeworm that can travel from gut to brain and cause preventable epilepsy. Learn how food safety, hygiene, and pig vaccination can help break the cycle.",
  },
  {
    imgSrc:
      "https://thumbs.dreamstime.com/b/rsv-icon-respiratory-syncytial-virus-isolated-background-vector-illustration-381702420.jpg",
    title: "Respiratory Syncytial Virus",
    link:
      "https://www.who.int/podcasts/episode/science-in-5/episode-144-little-lungs-big-risks-the-rsv-threat-to-infants",
    desc:
      "RSV is a leading cause of infant hospitalisation worldwide. Discover how prevention, awareness, and new immunisation options can help protect young children.",
  },
  {
    imgSrc:
      "https://www.metropolisindia.com/upgrade/blog/upload/24/02/Everything_you_need_to_know_about_Cholera1707909522.webp",
    title: "Air Pollution & Brain Health",
    link:
      "https://www.who.int/podcasts/episode/science-in-5/episode--141---air-pollution-damages-young-brains",
    desc:
      "Air pollution can affect brain health and increase risks related to dementia, anxiety, and depression. Explore how cleaner air can support healthier communities.",
  },
];

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Topic() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Health knowledge hub
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
            Explore health issues
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Browse helpful topics, nutrition guidance, and reliable health
            information tailored to common conditions.
          </p>
        </div>

        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {diseases.map((disease) => (
            <motion.article
              key={disease.title}
              variants={itemAnimation}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:border-green-200 hover:shadow-lg"
            >
              <img
                src={disease.img}
                alt={disease.title}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-green-50 transition duration-300 group-hover:scale-105 group-hover:ring-green-100 sm:h-28 sm:w-28"
              />

              <h2 className="mt-4 font-bold text-slate-800">{disease.title}</h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {disease.description}
              </p>
            
             
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl">
        <div className="mb-7 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Learn more
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            Featured health stories
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {articles.map((article) => (
            <motion.div
              key={article.title}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-green-300 hover:shadow-xl"
            >
              <Card2 {...article} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Change /feedback if your feedback page uses a different route */}
      <Link
        to="/about"
        aria-label="Send feedback"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/25 transition hover:-translate-y-1 hover:bg-green-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200"
      >
        Feedback
      </Link>
    </main>
  );
}

export default Topic;