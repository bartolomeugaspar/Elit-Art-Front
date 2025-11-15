import { Calendar, Users, Lightbulb } from 'lucide-react'

export default function HistorySection() {
  return (
    <section id="historia" className="py-20 bg-gradient-to-br from-white to-elit-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Frase-mestra */}
          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl font-light text-elit-gold italic mb-8">
              "A Artee é a nossa linguagem universal; a cultura, a nossa assinatura."
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Linha central - Hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-elit-red via-elit-yellow to-elit-orange" style={{height: 'calc(100% - 260px)'}}></div>

            {/* Fundacção */}
            <div className="relative mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-elit-red rounded-full flex items-center justify-center shadow-lg z-10">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-right">
                  <h3 className="text-3xl font-bold text-elit-dark mb-4">Fundacção</h3>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      <strong className="text-elit-red">13 de Fevereiro de 2024</strong>
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      O Elit'Arte, fundado no pretérito 13 de Fevereiro de 2024, é um Movimento Arteístico que nasceu da 
                      paixão pela Artee de dois jovens, <strong>Faustino Domingos</strong> e <strong>Luísa Gonçalves</strong>, 
                      como forma de transformacção pessoal, social, cultural e espiritual.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      O Movimento congrega várias expressões Arteísticas num só lugar (teatro, dança, música, literatura, 
                      pintura e cinema), a fim de promover um espaço de criacção, expressão, promoção e reflexão, 
                      sempre com forte conexão com a nossa identidade cultural.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src="icon.jpeg" 
                    alt="Fundadores do Elit'Arte" 
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-elit-yellow/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Evolução */}
            <div className="relative mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-elit-yellow rounded-full flex items-center justify-center shadow-lg z-10">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative lg:order-2">
                  <img 
                    src="/WhatsApp Image 2025-11-13 at 16.39.48.jpeg" 
                    alt="Membros fundadores" 
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-elit-orange/30 rounded-full animate-pulse delay-1000"></div>
                </div>
                
                <div className="lg:order-1 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-elit-dark mb-4">Evolução</h3>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-gray-700 leading-relaxed">
                      Algum tempo depois, recrutou-se outros cinco membros, a quem se denominou como sendo 
                      <strong className="text-elit-yellow"> "membros fundadores"</strong> que tiveram a responsabilidade 
                      de desenhar o estatuto e todo o projecto Arteístico do Elit'Arte.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Posteriormente, endereçou-se o convite a vários fazedores de Artee, nas disciplinas do teatro, 
                      música, cinema, pintura e literatura, maioritariamente alunos do 
                      <strong className="text-elit-orange"> Icra e do Marista</strong>, para fazerem pArtee das diferentes 
                      áreas Arteísticas que compõem o Elit'Arte.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivações */}
            <div className="relative">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-elit-orange rounded-full flex items-center justify-center shadow-lg z-10">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-3xl font-bold text-elit-dark mb-6">Motivações</h3>
                <div className="bg-gradient-to-r from-elit-red/10 via-elit-yellow/10 to-elit-orange/10 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "É saber que, a pArteir da Artee, podemos construir nos nossos Arteistas e na nossa gente 
                    uma mentalidade cada vez mais séria, mais comprometida com o país e consigo mesmo."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
