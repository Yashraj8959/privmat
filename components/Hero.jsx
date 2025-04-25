"use client"
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'; // For animated text

const HeroSection = () => {
    
  return (
    <section className='w-full pt-32 md:pt-44 lg:pt-52 pb-10'>
         <div className="space-y-8 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-400">
            <TypeAnimation
              sequence={[
                'Your Privacy Matters',
                1500,
                'Take Control of Your Data',
                1500,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </h1>
          <p className="mx-auto max-w-[600px] text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Privmat empowers you to track your data footprint, generate fake information for privacy, and monitor for data breaches. Reclaim your digital privacy today.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Explore Dashboard
            </Button>
          </Link>
          <Link href="/privacy-policy">
            <Button variant="outline" size="lg" className="px-8 text-gray-700 dark:text-gray-300">
            Learn More
            </Button>
          </Link>
        </div>
        
        <div className='hero-image-wrapper mt-10 md:mt-4 flex items-center justify-center' >
                <div  className='hero-image'>
                    <Image 
                    src={"/hero5.png"}
                    alt="Dashboard Preview"
                    width={500}
                    height={500}
                    // className='rounded-lg shadow-2xl  mx-auto'
                    priority
                    />
                </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
