import dynamic from 'next/dynamic'
import Header from '@/components/Header/Header'
import HomeSection from '@/components/sections/HomeSection/HomeSection'
import CallCTASection from '@/components/CallCTASection/CallCTASection'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import Footer from '@/components/Footer/Footer'

const PropertySection = dynamic(() => import('@/components/sections/PropertySection/PropertySection'))
const BuildingSection = dynamic(() => import('@/components/sections/BuildingSection/BuildingSection'))
const LocationSection = dynamic(() => import('@/components/sections/LocationSection/LocationSection'))
const ContactSection  = dynamic(() => import('@/components/sections/ContactSection/ContactSection'))

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomeSection />
        <PropertySection />
        <BuildingSection />
        <LocationSection />
        <ContactSection />
        <CallCTASection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
