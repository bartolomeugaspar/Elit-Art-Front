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
    <div className="min-h-screen bg-gradient-to-br from-elit-red/5 via-elit-yellow/5 to-elit-green/5">
      <Header />
      <HeroSection />
      <AreasSection />
      <ProjectsSection />
      <ValuesSection />
      <Footer />
    </div>
  )
}
