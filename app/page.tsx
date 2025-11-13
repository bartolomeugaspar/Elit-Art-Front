import { 
  Header, 
  Footer, 
  HeroSection, 
  AreasSection, 
  ProjectsSection, 
  ValuesSection 
} from '@/components'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      <Header />
      <HeroSection />
      <AreasSection />
      <ProjectsSection />
      <ValuesSection />
      <Footer />
    </div>
  )
}
