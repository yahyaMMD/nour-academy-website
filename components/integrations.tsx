import { Tag } from "./tag"
import { IntegrationColumns } from "./integration-column"

const partners = [
  {
    name: "YOUJOY",
    icon: "/images/YOUJOY.png",
    description: "Spécialiste des appareils radiographiques dentaires, offrant des solutions d'imagerie diagnostique haute résolution.",
  },
  {
    name: "Anthos",
    icon: "/images/Anthos.png",
    description: "Fabricant de pièces à main dentaires et turbines offrant précision chirurgicale et durabilité exceptionnelle.",
  },
  {
    name: "MyRay",
    icon: "/images/mayray.png",
    description: "Fournisseur de systèmes d'imagerie dentaire 2D/3D et équipements radiologiques innovants.",
  },
  {
    name: "W&H",
    icon: "/images/W&H.png",
    description: "Leader en technologie de fraisage dentaire et solutions implantaires de pointe pour les laboratoires.",
  },
  {
    name: "Sirio",
    icon: "/images/Sirio.png",
    description: "Concepteur d'équipements de laboratoire dentaire professionnels, incluant fours céramiques et polymériseurs.",
  },
  {
    name: "Soco",
    icon: "/images/Soco.png",
    description: "Expert en capteurs intra-oraux numériques pour une imagerie dentaire rapide et fiable.",
  },
  {
    name: "coxo",
    icon: "/images/coxo.png",
    description: "Pionnier des matériaux dentaires haute performance pour des restaurations esthétiques et durables.",
  }
];

export const Integrations = () => {
  return (
    <section className="py-24 overflow-hidden ">
      <div className="container">
        <div className="grid lg:grid-cols-2 items-center lg:gap-16">
          <div>
            <Tag>Nos Partenaires</Tag>
            <h2 className="text-5xl lg:text-6xl text-gray-800 font-medium mt-6">
              Partenariats avec les <span style={{ color: '#6C3C74' }}> leaders mondiaux </span> 
              en équipement dentaire
            </h2>
            <p className="text-lg text-gray-600 mt-6 max-w-lg">
              Chez DentalOuest, nous sélectionnons rigoureusement nos fournisseurs pour vous proposer 
              uniquement des équipements certifiés, performants et adaptés aux exigences 
              des cabinets dentaires modernes.
            </p>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Notre expertise technique nous permet de vous conseiller dans le choix 
              des solutions les plus adaptées à votre pratique.
            </p>
          </div>

          <div>
            <div className="h-[800px] grid md:grid-cols-2 gap-4 mt-8 lg:mt-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,to_black_90%,transparent)]">
              <IntegrationColumns integrations={partners} />
              <IntegrationColumns
                integrations={partners.slice().reverse()}
                className="hidden md:flex"
                reverse={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}