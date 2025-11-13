import { 
  Header, 
  Footer, 
  HeroSection, 
  PresentationSection,
  IdentitySection,
  HistorySection,
  AreasSection, 
  TeamSection,
  CommunitySection,
  GallerySection,
  ValuesSection,
  ContactSection
} from '@/components'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <PresentationSection />
      <IdentitySection />
      <HistorySection />
      <AreasSection />
      <TeamSection />
      <CommunitySection />
      <GallerySection />
      <ValuesSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
