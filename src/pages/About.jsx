import React from 'react';
import doct1 from "../assets/doct1.jpg";
import doct2 from "../assets/doct2.webp";
import { motion } from 'framer-motion';
import { useState } from 'react';
import emailjs from "@emailjs/browser";
import axios from 'axios';
function About() {
    const [form , setForm] = useState({
        name:"",
        comment:""
    });

     const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };
    const handleSubmit = async(e) =>{
              e.preventDefault();

        try{
           emailjs.send(
        "service_3u0tou7",
        "template_wytz1e6",
        form,
        "XiBB-DsDcmdyuZj81"
      ).then(()=>{
        alert("Message Sent Successfully");
        setForm({
            name:"",
            comment:""
        })
      })
        }catch(error){
            console.log(error)
        }
    
    }
  return (
    <div>
      <motion.div 
       whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true,amount: 0.2  }}
      transition={{ duration: 0.9 }}
      className='flex flex-row justify-around pt-20'>
        <div className='flex flex-col  items-center'>
                   <img src={doct1} alt="doctor" className='w-110 h-80'></img>
                    <h3 className="mt-3 text-lg font-semibold ">Dr. Ridhima Mehta</h3>
                    <p className="text-gray-500">Nutritionist</p>

        </div>
        <div className='flex flex-col items-center '>
              <img src={doct2} alt="doctor" className='w-80 h-80'></img>
                <h3 className="mt-3 text-lg font-semibold">Dr. John Smith</h3>
                    <p className="text-gray-500">Nutritionist</p>

        </div>

      </motion.div>
      <div className='flex justify-center mt-15'>
        <div className='max-w-6xl px-6 space-y-10 '>
       <p className='text-justify text-lg leading-8 '>At our diet and wellness platform, we believe that healthy living starts with balanced nutrition and informed choices. Our mission is to provide reliable, practical, and personalized diet guidance that helps people achieve their health goals, whether it's weight loss, weight gain, improved fitness, or overall well-being. We focus on sustainable lifestyle changes rather than quick fixes.
</p>
       <p className='text-justify text-lg leading-8'>Our team is dedicated to creating easy-to-follow meal plans, healthy recipes, nutrition tips, and educational resources backed by current nutritional knowledge. We understand that every individual has unique dietary needs, preferences, and goals, so we strive to offer solutions that are flexible, realistic, and suitable for different lifestyles.
</p>
       <p className='text-justify text-lg leading-8'>We are committed to empowering our community with the knowledge and motivation needed to make healthier choices every day. Whether you're just beginning your wellness journey or looking to maintain a healthy lifestyle, we're here to support you with trusted information, practical tools, and ongoing inspiration to help you succeed.
</p> 
</div>
      </div>


      <div className='flex flex-col  items-center justify-center min-h-screen'>
<div className='max-w-3xl w-full px-6 py-6 bg-gray-100'>


    
        <div className='flex justify-center items-center text-3xl font-bold mb-6 ' >
            <h2>Send Your Queries...</h2>
            </div>

        <form className='space-y-5' onSubmit={handleSubmit}>
           
            <div>
                <label className='block text-gray-700 font-medium mb-2'>Enter Your Name</label><br/>
                <input 
                type="text"
                name="name"
                onChange={handleChange}
                className='w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none '
                value={form.name}
                />


            </div>
           

            <div>
                <textarea
                rows="5"
                cols="100"
                value={form.comment}
                name="comment"
                onChange={handleChange}
                className='w-full border border-gray-400 rounded-lg'
                placeholder=' Comment...'
                />
            </div>

            <div >
                <button type='submit'className=' bg-green-600  rounded-lg hover:bg-green-900 font-semibold text-white w-30 h-10 ' >Submit</button>
            </div>
            
        </form>
      </div>
    </div>
    </div>
  );
}

export default About;
