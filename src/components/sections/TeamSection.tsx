import { Users, Mail, Phone, Facebook, Instagram } from 'lucide-react'

export default function TeamSection() {
  const leaders = [
    {
      name: "Faustino Domingos",
      artisticName: "Guido Alves",
      role: "Coordenador",
      area: "Literatura e Cinema",
      description: "Coordenador do Elit'arte, director da área do cinema e fundador. Formação artística em teatro (15+ anos) e cinema.",
      quote: "Gosto tanto de escrever quanto gosto de comer, é uma necessidade vital para a minha alma.",
      email: "faustinodomingos83@hotmail.com",
      phone: "927935543",
      whatsapp: "950291335"
    },
    {
      name: "Josemara Comongo",
      artisticName: "Maíris de Jesus",
      role: "Porta-voz",
      area: "Literatura",
      description: "Porta-voz, directora da área da literatura e fundadora. Vencedora do Concurso Literário 'Quem me dera ser onda' 2019.",
      quote: "Aceitei ser fundadora deste Movimento para ressuscitar a artista que estava encubada em mim.",
      email: "mairisdejesus.mj@gmail.com",
      phone: "936346918"
    },
    {
      name: "Luísa Gonçalves",
      role: "Tesoureira",
      area: "Teatro e Cinema",
      description: "Tesoureira e fundadora. Actriz de teatro e cinema, estudante de pedagogia no Magistério Marista.",
      quote: "Representar, para mim, é Vida, e a 'Vida só é vida quando é vivida com vida'.",
      email: "luisacarolina@gamil.com",
      phone: "930729860"
    }
  ]

  const artists = [
    {
      name: "Adelino Canganjo Vitorino Mateus",
      area: "Música (Piano)",
      description: "Começou a cantar no coral da igreja, onde sentiu a vocação pelo piano.",
      email: "deliano053@gmail.com",
      phone: "949437675"
    },
    {
      name: "Mariana Tabina Passagem Feitio",
      area: "Teatro e Cinema",
      description: "A representação é uma forma de escape e ferramenta de transformação social.",
      email: "mariannafeitio0@gmail.com",
      phone: "931194171"
    },
    {
      name: "Abiú José Duas Horas Gabriel",
      artisticName: "Abiú",
      role: "Director da área de desenho",
      area: "Desenho e Pintura",
      description: "Artista comprometido e apaixonado pelo desenho e pintura.",
      email: "abiugabrielduashoras@gmail.com",
      phone: "937051439"
    }
  ]

  return (
    <section id="equipa" className="py-20 bg-gradient-to-br from-elit-light to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl font-light text-elit-blue italic mb-8">
            "Grandes histórias são contadas por grandes equipas."
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-elit-dark mb-6">
            Equipa <span className="text-elit-red">Administrativa</span>, Artística e Técnica
          </h2>
        </div>

        {/* Líderes */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-elit-dark mb-12 text-center">Líderes</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-elit-red rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-elit-dark">{leader.name}</h4>
                  {leader.artisticName && (
                    <p className="text-elit-orange font-medium">({leader.artisticName})</p>
                  )}
                  <p className="text-elit-blue font-semibold">{leader.role}</p>
                  <p className="text-gray-600">{leader.area}</p>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{leader.description}</p>
                
                <blockquote className="italic text-elit-dark bg-elit-light p-4 rounded-lg mb-6 text-sm">
                  "{leader.quote}"
                </blockquote>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-elit-red mr-2" />
                    <span className="text-gray-600">{leader.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-elit-green mr-2" />
                    <span className="text-gray-600">{leader.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artistas */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-elit-dark mb-12 text-center">Artistas do Movimento</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-elit-yellow rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-elit-dark">{artist.name}</h4>
                  {artist.artisticName && (
                    <p className="text-elit-orange text-sm">({artist.artisticName})</p>
                  )}
                  {artist.role && (
                    <p className="text-elit-blue font-medium text-sm">{artist.role}</p>
                  )}
                  <p className="text-gray-600 text-sm">{artist.area}</p>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{artist.description}</p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 text-elit-red mr-2" />
                    <span className="text-gray-600">{artist.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 text-elit-green mr-2" />
                    <span className="text-gray-600">{artist.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-elit-red to-elit-yellow p-8 rounded-2xl text-white">
          <h3 className="text-2xl font-bold mb-4">Junte-se ao Nosso Movimento</h3>
          <p className="text-lg mb-6">Faça parte da transformação cultural de Angola</p>
          <button className="bg-white text-elit-red px-8 py-3 rounded-full font-bold hover:bg-elit-light transition-colors">
            Contacte-nos
          </button>
        </div>
      </div>
    </section>
  )
}
