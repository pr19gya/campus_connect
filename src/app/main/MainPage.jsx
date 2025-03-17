import React from 'react'
import { LampContainer } from '../../components/ui/lamp'
import { motion } from "motion/react";
import Navbar from './../../components/global/Navbar'
import { ContainerScroll } from '../../components/ui/screen';
import { ColourfulText } from '../../components/ui/colourful';
import { SparklesCore } from '../../components/ui/sparkles';



const MainPage = () => {
  return (
    <div>
        <Navbar/>
          <LampContainer>
            <motion.h1
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="mt-2 bg-gradient-to-br from-slate-300 to-slate-500 py-0 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-4xl ">
              Collaborate. Learn. Grow. Together on <br/><b className='md:text-8xl '>Campus Connect!</b>
            </motion.h1>
          </LampContainer>
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Got a doubt?
                  </span>
                  <br/>
                  Ask away and let the community solve it!
                  <br />  
                </h1>
              </>
              }
          >
            <img
              src="https://res.cloudinary.com/dqb71iaqi/image/upload/v1742203779/Screenshot_2025-03-17_145510_cxdsen.png"
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </div>
    
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
          <motion.img
            src="https://res.cloudinary.com/dqb71iaqi/image/upload/v1742204160/Screenshot_2025-03-17_150428_ekpzsb.png"
            className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
            Be the genius who helps others 
            <br />
            <ColourfulText text="share your knowledge now!" /> 
          </h1>
        </div>
        <div className="h-[40rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
          <div className="w-full absolute inset-0 h-screen">
            <SparklesCore
              id="tsparticlesfullpage"
              background="slate-950"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>
          <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
            Mentor or be mentored
            <br/>
            connect, learn, and grow!
          </h1>
        </div>
    </div>
  )
}

export default MainPage