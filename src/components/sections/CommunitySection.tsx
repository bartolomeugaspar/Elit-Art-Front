import { Heart, BookOpen, Users, GraduationCap, Target } from 'lucide-react'

export default function CommunitySection() {
  const impacts = [
    {
      icon: BookOpen,
      title: "Fomento da Leitura",
      description: "Projectos virados para o livro e a pintura, especialmente no seio infantil, atacando as insuficiências escritas e leitoras."
    },
    {
      icon: Users,
      title: "Transformação Social",
      description: "Promoção das artes e ofícios como ferramentas de transformação pessoal e social nas periferias de Luanda."
    },
    {
      icon: GraduationCap,
      title: "Apoio Educativo",
      description: "Serviços de educação para melhorar a proficiência em Língua Portuguesa e Matemática."
    }
  ]

  const differentials = [
    {
      icon: Heart,
      title: "Fundação de Caridade",
      description: "Área dedicada a prestar ajuda académica, artística e de ofícios, incluindo bolsas para crianças carenciadas."
    },
    {
      icon: Target,
      title: "Política Organizativa",
      description: "Divisão por escalões A, B e C, onde os melhores beneficiam de formações, bolsas e subsídios."
    },
    {
      icon: Users,
      title: "Palestras de Auto-ajuda",
      description: "Equipa responsável por palestras para jovens de 14-18 anos, descobrindo talentos e vocações."
    }
  ]

  return (
    <section id="comunidade" className="py-20 bg-gradient-to-br from-white to-elit-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl font-light text-elit-green italic mb-8">
            "Não é apenas o palco, mas são as vidas que tocamos."
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-elit-dark mb-6">
            Actividades nas <span className="text-elit-red">Comunidades</span>
          </h2>
        </div>

        {/* Impacto Social e Cultural */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-elit-dark mb-12 text-center">Impacto Social e Cultural</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {impacts.map((impact, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-elit-red rounded-full flex items-center justify-center mx-auto mb-6">
                  <impact.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-4">{impact.title}</h4>
                <p className="text-gray-700 leading-relaxed">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diferenciais */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-xl font-light text-elit-orange italic mb-4">
              "Mais do que arte, somos inspiração para uma Angola melhor."
            </p>
            <h3 className="text-3xl font-bold text-elit-dark">Diferenciais</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {differentials.map((diff, index) => (
              <div key={index} className="bg-gradient-to-br from-elit-yellow/10 to-elit-green/10 p-8 rounded-2xl border border-elit-yellow/20 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-elit-yellow rounded-full flex items-center justify-center mb-6">
                  <diff.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-elit-dark mb-4">{diff.title}</h4>
                <p className="text-gray-700 leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Propostas para Financiadores */}
        <div className="bg-gradient-to-br from-orange/10 to-orange-50/10 p-8 rounded-2xl text-elit-dark text-center border border-black/10">
          <p className="text-xl font-light italic mb-4">
            "No Elit'arte, financiadores não apenas apoiam a arte, mas transformam vidas."
          </p>
          <h3 className="text-3xl font-bold mb-6">Propostas para Financiadores</h3>
          <p className="text-lg mb-8 max-w-4xl mx-auto">
            Buscamos parceiros que compartilham da nossa paixão pela arte, cultura e pelo amor ao nosso país. 
            Com estes apoios poderemos expandir ainda mais o nosso impacto, levando a nossa arte angolana 
            para mais pessoas e comunidades.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white/10 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4">Benefícios</h4>
              <ul className="text-elit-dark space-y-2">
                <li>• Visibilidade da marca nos espectáculos</li>
                <li>• Participação nas actividades culturais</li>
                <li>• Acompanhamento escolar para filhos</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4">Impacto Social</h4>
              <ul className="text-elit-dark space-y-2">
                <li>• Orientação vocacional para jovens</li>
                <li>• Desconstrução de mentalidades limitantes</li>
                <li>• Desenvolvimento cultural sustentável</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
