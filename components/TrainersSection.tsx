'use client'
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "./Container";
import { FadeIn } from "./FadeIn";
import Link from "next/link";

const trainers = [
  {
    id: 1,
    name: "Dr. Alla Eddine Sadouki",
    specialty: "Implantologie & Chirurgie Orale",
    bio: "Pionnier de l'implantologie en Algérie avec plus de 15 ans d'expérience. Formateur certifié internationalement et membre de plusieurs sociétés savantes.",
    image: "/images/trainers/dr-sadouki.jpg"
  },
  {
    id: 2,
    name: "Dr. Sarah Benali",
    specialty: "Orthodontie",
    bio: "Spécialiste en orthodontie invisible avec une pratique exclusive depuis 10 ans. Formatrice agréée pour plusieurs systèmes d'aligneurs.",
    image: "/images/trainers/dr-benali.jpg"
  },
  {
    id: 3,
    name: "Dr. Karim Boudjemaa",
    specialty: "Endodontie Microscopique",
    bio: "Expert en endodontie avancée avec plus de 2000 traitements réalisés sous microscope. Enseignant dans plusieurs programmes de formation continue.",
    image: "/images/trainers/dr-boudjemaa.jpg"
  },
  {
    id: 4,
    name: "Dr. Leila Merabet",
    specialty: "Prothèse Esthétique",
    bio: "Spécialiste en réhabilitation orale et esthétique du sourire. Conceptrice de plusieurs techniques innovantes en prothèse fixe.",
    image: "/images/trainers/dr-merabet.jpg"
  },
  {
    id: 5,
    name: "Dr. Yacine Zitouni",
    specialty: "Parodontologie",
    bio: "Expert en traitement des maladies parodontales et techniques de régénération tissulaire. Auteur de plusieurs publications scientifiques.",
    image: "/images/trainers/dr-zitouni.jpg"
  }
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const TrainerCard = ({ trainer }: { trainer: typeof trainers[0] }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex flex-col min-w-[300px] max-w-sm flex-shrink-0 rounded-2xl bg-white shadow-lg",
        "border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1",
        "overflow-hidden transform-gpu snap-center"
      )}
    >
      <div className="relative h-64 w-full">
        <Image
          src={trainer.image}
          alt={trainer.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-semibold text-white drop-shadow-md">{trainer.name}</h3>
          <p className="text-[#73CBE9] font-medium text-sm">{trainer.specialty}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{trainer.bio}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-[#9817A0] bg-[#f3e8f6] rounded-full">
            🏅 Expert Certifié
          </span>
          <span className="inline-block px-3 py-1 text-xs font-semibold text-[#321246] bg-[#ede9f3] rounded-full">
            🎓 Formateur Agréé
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const TrainersSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="trainers" className="py-20 bg-gradient-to-b from-white to-[#F8F9FA] relative">
      <Container>
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#321246] mb-4">
              Nos Experts
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nos formateurs sont des dentistes et professionnels de santé dentaire avec des années d&#39;expérience dans leurs domaines respectifs. Chacun d&#39;eux est reconnu pour son expertise, sa pédagogie et sa passion pour le développement de la profession.
            </p>
          </div>

          {/* Scroll Buttons */}
          <button
            onClick={() => scroll(-320)}
            className="absolute left-6 top-[50%] z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-200 -translate-y-1/2"
          >
            <svg className="w-5 h-5 text-[#321246]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll(320)}
            className="absolute right-6 top-[50%] z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-200 -translate-y-1/2"
          >
            <svg className="w-5 h-5 text-[#321246]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Trainer Carousel */}
          <motion.div
            ref={containerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto pb-12 pt-2 scrollbar-hide md:snap-none"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } }
            }}
          >
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </motion.div>

          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8F9FA] to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8F9FA] to-transparent"></div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-[#321246] mb-4">
              Prêt à apprendre des meilleurs experts dentaires ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Découvrez nos prochaines formations animées par ces professionnels renommés.
            </p>
            <button className="inline-block bg-[#9817A0] hover:bg-[#7C1284] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300">
                <Link href="/#courses">
                  <span className="text-lg">Voir les formations</span>
                </Link>
            </button>
          </motion.div>
        </FadeIn>
      </Container>
    </section>
  );
};

export default TrainersSection;
