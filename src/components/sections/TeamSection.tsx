import { Users, Mail, Phone, Facebook, Instagram } from 'lucide-react'

export default function TeamSection() {
  const leaders = [
    {
      name: "Faustino Domingos",
      ArteisticName: "Guido Alves",
      role: "Coordenador",
      area: "Literatura e Cinema",
      description: "Coordenador do Elit'Arte, director da área do cinema e fundador. FormacçãoArtística em teatro (15+ anos) e cinema.",
      quote: "Gosto tanto de escrever quanto gosto de comer, é uma necessidade vital para a minha alma.",
      email: "faustinodomingos83@hotmail.com",
      phone: "927935543",
      whatsapp: "950291335"
    },
    {
      name: "Josemara Comongo",
      ArteisticName: "Maíris de Jesus",
      role: "Porta-voz",
      area: "Literatura",
      description: "Porta-voz, directora da área da literatura e fundadora. Vencedora do Concurso Literário 'Quem me dera ser onda' 2019.",
      quote: "Aceitei ser fundadora deste Movimento para ressuscitar a Arteista que estava encubada em mim.",
      email: "mairisdejesus.mj@gmail.com",
      phone: "936346918"
    },
    {
      name: "Luísa Gonçalves",
       ArteisticName: "Mulher Rei",
      role: "Tesoureira",
      area: "Teatro e Cinema",
      description: "Tesoureira e fundadora. Actriz de teatro e cinema, estudante de pedagogia no Magistério Marista.",
      quote: "Representar, para mim, é Vida, e a 'Vida só é vida quando é vivida com vida'.",
      email: "luisacarolina@gamil.com",
      phone: "930729860"
    }
  ]

  const Arteists = [
    {
      name: "Adelino Canganjo Vitorino Mateus",
      area: "Música (Piano)",
      description: "Começou a cantar no coral da igreja, onde sentiu a vocacção pelo piano.",
      email: "deliano053@gmail.com",
      phone: "949437675"
    },
    {
      name: "Mariana Tabina Passagem Feitio",
      area: "Teatro e Cinema",
      description: "A representacção é uma forma de escape e ferramenta de transformacção social.",
      email: "mariannafeitio0@gmail.com",
      phone: "931194171"
    },
    {
      name: "Abiú José Duas Horas Gabriel",
      ArteisticName: "Abiú",
      role: "Director da área de desenho",
      area: "Desenho e Pintura",
      description: "Arteista comprometido e apaixonado pelo desenho e pintura.",
      email: "abiugabrielduashoras@gmail.com",
      phone: "937051439"
    }
  ]

  return (
    <section id="equipa" className="py-20 bg-gradient-to-br from-elit-light to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl font-light text-elit-gold italic mb-8">
            "Grandes histórias são contadas por grandes equipas."
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-elit-dark mb-6">
            Equipa <span className="text-elit-red">Administrativa</span>,Artística e Técnica
          </h2>
        </div>

        {/* Líderes */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-elit-dark mb-12 text-center">Líderes</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  {index === 0 ? (
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <img 
                        src="/Design sem nome-fotor-20251113211836.png" 
                        alt="Faustino Domingos (Guido Alves)" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : index === 1 ? (
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <img 
                        src="/jos.jpeg" 
                        alt="Josemara Comongo (Maíris de Jesus)" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : index === 2 ? (
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <img 
                        src="/lu.jpeg" 
                        alt="Luísa Gonçalves" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-elit-red rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-elit-dark">{leader.name}</h4>
                  {leader.ArteisticName && (
                    <p className="text-elit-orange font-medium">({leader.ArteisticName})</p>
                  )}
                  <p className="text-elit-gold font-semibold">{leader.role}</p>
                  <p className="text-gray-600">{leader.area}</p>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{leader.description}</p>
                
                <blockquote className="italic text-elit-dark bg-elit-light p-4 rounded-lg mb-6 text-sm">
                  "{leader.quote}"
                </blockquote>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-stArte">
                    <Mail className="w-4 h-4 text-elit-red mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 break-all">{leader.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-elit-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{leader.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artistas*/}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-elit-dark mb-12 text-center">Artistas do Movimento</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Arteists.map((Arteist, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-elit-yellow rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-elit-dark">{Arteist.name}</h4>
                  {Arteist.ArteisticName && (
                    <p className="text-elit-orange text-sm">({Arteist.ArteisticName})</p>
                  )}
                  {Arteist.role && (
                    <p className="text-elit-gold font-medium text-sm">{Arteist.role}</p>
                  )}
                  <p className="text-gray-600 text-sm">{Arteist.area}</p>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{Arteist.description}</p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-stArte">
                    <Mail className="w-3 h-3 text-elit-red mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 break-all">{Arteist.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 text-elit-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{Arteist.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
