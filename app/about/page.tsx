import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const metadata: Metadata = {
  title: 'About Us - ShopEase',
  description: 'Learn more about ShopEase, our mission, vision, and the team behind your favorite online shopping destination.',
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const flipVariants = {
  front: { rotateY: 0, transition: { duration: 0.4 } },
  back: { rotateY: 180, transition: { duration: 0.4 } },
};

export default function AboutPage() {
  const [storyRef, storyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <motion.div
          className="relative h-full flex items-center justify-center text-center px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">About ShopEase</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              Your trusted partner for quality products and exceptional shopping experience
            </p>
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      <motion.section
        ref={storyRef}
        initial="hidden"
        animate={storyInView ? 'visible' : 'hidden'}
        variants={fadeIn}
        className="py-12 sm:py-16 px-4"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Story
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
                Founded in 2023, ShopEase began with a simple mission: to make online shopping truly easy and enjoyable. 
                We believe that shopping should be a pleasure, not a chore.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                What started as a small venture has now grown into a trusted e-commerce platform offering thousands of 
                quality products across multiple categories. Our journey has been defined by our commitment to customer 
                satisfaction and product excellence.
              </p>
            </div>
            <motion.div
              className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <Image 
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80" 
                alt="ShopEase team working" 
                fill 
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section
        ref={valuesRef}
        initial="hidden"
        animate={valuesInView ? 'visible' : 'hidden'}
        variants={fadeIn}
        className="py-12 sm:py-16 px-4 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Quality',
                description: 'We never compromise on the quality of our products. Each item is carefully selected and verified.',
                icon: '✓',
              },
              {
                title: 'Customer First',
                description: 'Your satisfaction is our top priority. Were committed to providing exceptional service at every step.',
                icon: '♥',
              },
              {
                title: 'Innovation',
                description: 'We continuously evolve and improve our platform to enhance your shopping experience.',
                icon: '★',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4 text-blue-600 dark:text-blue-400">{value.icon}</div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        ref={teamRef}
        initial="hidden"
        animate={teamInView ? 'visible' : 'hidden'}
        variants={fadeIn}
        className="py-12 sm:py-16 px-4"
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80',
                bio: 'Sarah founded ShopEase with a vision to revolutionize online shopping.',
              },
              {
                name: 'Michael Chen',
                role: 'CTO',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                bio: 'Michael leads our tech team to build a seamless platform.',
              },
              {
                name: 'Priya Patel',
                role: 'Head of Design',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80',
                bio: 'Priya crafts beautiful and intuitive user experiences.',
              },
              {
                name: 'David Wilson',
                role: 'Customer Experience',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
                bio: 'David ensures every customer has a great experience.',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <motion.div
                  className="relative h-64 w-full"
                  variants={flipVariants}
                  initial="front"
                  whileHover="back"
                >
                  {/* Front Side */}
                  <motion.div
                    className="absolute inset-0"
                    variants={{ front: { rotateY: 0 }, back: { rotateY: -180 } }}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  {/* Back Side */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-blue-600 dark:bg-blue-800 text-white p-4 text-center"
                    variants={{ front: { rotateY: 180 }, back: { rotateY: 0 } }}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <p className="text-sm sm:text-base">{member.bio}</p>
                  </motion.div>
                </motion.div>
                <div className="p-4 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? 'visible' : 'hidden'}
        variants={fadeIn}
        className="py-12 sm:py-16 px-4 bg-blue-600 dark:bg-blue-800"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">Get in Touch</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Have questions or feedback? We'd love to hear from you. Our customer support team is always ready to help.
          </p>
          <motion.a
            href="mailto:contact@shopease.com"
            className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}