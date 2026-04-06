import Header from '@/components/Header/Header'
import HomeSection from '@/components/sections/HomeSection/HomeSection'
import PropertySection from '@/components/sections/PropertySection/PropertySection'
import BuildingSection from '@/components/sections/BuildingSection/BuildingSection'
import LocationSection from '@/components/sections/LocationSection/LocationSection'
import ContactSection from '@/components/sections/ContactSection/ContactSection'
import Footer from '@/components/Footer/Footer'

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
      </main>
      <Footer />
    </>
  )
}
