'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CloudUpload,
  PackageOpen,
  Share2,
  Shield,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from './dashboard/_components/header'
import { Footer } from './dashboard/_components/footer'

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

export default function LandingPage() {
  return (
    <div className='min-h-screen'>
      <Header />
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-20 md:pt-24 md:pb-28'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-center'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              className='flex flex-col space-y-6'
            >
              <div className='inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary'>
                <span className='flex h-2 w-2 rounded-full bg-primary mr-2'></span>
                New Feature: Real-time collaboration
              </div>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground'>
                Store, share and{' '}
                <span className='text-primary'>collaborate</span> on files
              </h1>
              <p className='text-lg md:text-xl text-muted-foreground max-w-lg'>
                FileDrive helps you securely store, organize, and share your
                files from anywhere, on any device.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Button
                  size='lg'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground'
                >
                  <Link
                    href='/dashboard/files'
                    className='rounded-mdpx-3.5 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline-2 focus-visible:outline-offset-2'
                  >
                    Get started
                  </Link>{' '}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Shield className='h-4 w-4 text-primary' />
                <span>No credit card required • Free 5GB storage</span>
              </div>
            </motion.div>

            <motion.div
              initial='hidden'
              animate='visible'
              variants={fadeInScale}
              className='relative mx-auto max-w-[500px]'
            >
              <div className='relative z-10 rounded-xl border border-border bg-card p-2 shadow-xl'>
                <Image
                  src='/add-files2.svg'
                  width={500}
                  height={400}
                  alt='FileDrive Dashboard'
                  className='rounded-lg'
                />
                <div className='absolute -bottom-3 -right-3 flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground'>
                  <CloudUpload className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    Upload files easily
                  </span>
                </div>
              </div>
              <div className='absolute -z-10 -top-6 -left-6 w-full h-full rounded-xl bg-primary/10'></div>
            </motion.div>
          </div>
        </div>

        {/* Background elements */}
        <div className='absolute top-0 left-0 -z-10 h-full w-full'>
          <div className='absolute top-1/4 left-1/4 h-40 w-40 rounded-full bg-primary/10 opacity-30 blur-3xl'></div>
          <div className='absolute bottom-1/4 right-1/4 h-60 w-60 rounded-full bg-primary/20 opacity-30 blur-3xl'></div>
        </div>
      </section>

      {/* How it works section */}
      <section className='py-20 bg-muted'>
        <div className='container mx-auto px-4 md:px-6'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className='text-center mb-16'
          >
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              How FileDrive works
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Get started in minutes with our simple, intuitive platform.
            </p>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className='grid grid-cols-1 md:grid-cols-3 gap-8'
          >
            {[
              {
                step: '01',
                title: 'Create an account',
                description:
                  'Sign up for free and get started with 5GB of storage.',
                icon: <PackageOpen className='h-6 w-6 text-primary' />,
              },
              {
                step: '02',
                title: 'Upload your files',
                description:
                  'Drag and drop files or use our uploader to add your content.',
                icon: <CloudUpload className='h-6 w-6 text-primary' />,
              },
              {
                step: '03',
                title: 'Share and collaborate',
                description: 'Invite others to view or edit your files.',
                icon: <Share2 className='h-6 w-6 text-primary' />,
              },
            ].map((step, index) => (
              <motion.div key={index} variants={fadeIn} className='relative'>
                <div className='bg-card rounded-xl border border-border p-6 relative z-10'>
                  <div className='text-sm font-bold text-primary mb-2'>
                    {step.step}
                  </div>
                  <h3 className='text-xl font-semibold mb-3'>{step.title}</h3>
                  <div className='flex  gap-2 justify-between items-start'>
                    <p className='text-muted-foreground mb-4'>
                      {step.description}
                    </p>
                    <div className='rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center'>
                      {step.icon}
                    </div>
                  </div>
                </div>
                {index < 2 && (
                  <div className='hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 z-20'>
                    <ArrowRight className='h-6 w-6 text-primary/30' />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
