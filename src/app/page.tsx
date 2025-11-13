import { 
  Header, 
  Footer, 
  HeroSection, 
  PresentationSection,
  IdentitySection,
  HistorySection,
  AreasSection, 
  ProjectsSection, 
  ValuesSection 
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
      <ProjectsSection />
      <ValuesSection />
      <Footer />
    </div>
  )
}
