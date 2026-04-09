export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Resume", link: "/resume" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    mainTitle: "About Me",
    title:
      "I am a third-year Information Technology student, deeply passionate about the ever-evolving world of web development. ",
    description: "",
    para: "I am an enthusiastic MERN Stack Developer with a passion for crafting user-friendly web applications. Adept in the MERN stack along with NextJs 13 and driven to leverage these skills to develop impactful solutions.",
    para2:
      "Let's connect and explore how we can collaborate to create innovative solutions in the dynamic world of web development!🚀",
    className:
      "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh] w-full",
    imgClassName: "w-full h-full",
    titleClassName: "justify-center",
    img: "/grid.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for web development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title:
      "Currently building a Anonymous Ouestion Application with MernStack as well as integrating AI with it.",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Afaq Academy",
    des: "Afaq Academy is an e-learning platform designed to provide educational resources, courses, and tools to empower learners. It likely focuses on accessibility, high-quality content, and a user-friendly experience, tailored to help students and professionals achieve their goals. Would you like me to craft a detailed description or highlight specific features?",
    img: "/images/afaqacademy.png",
    iconLists: ["/images/nextjs.svg", "/images/tailwind.svg", "/images/typescript.svg", "/images/mongodb.svg"],
    link: "https://www.afaqacademie.com/",
  },
  {
    id: 2,
    title: "Carisma Dental clinic",
    des: "Carisma Dental Clinic's website, featuring a user-friendly online appointment booking system that allows patients to easily schedule dental visits at their convenience. The platform showcases the clinic's services, such as routine checkups, cosmetic dentistry, and more, while ensuring a smooth and professional experience for patients seeking high-quality dental care.",
    img: "/images/carismadental.png",
    iconLists: ["/images/nextjs.svg", "/images/tailwind.svg", "/images/prisma.svg", "/images/aws.svg"],
    link: "https://www.carismadentalclinic.com/",
  },
  {
    id: 3,
    title: "Pizza fista",
    des: " Pizza Fista, an intuitive online food ordering website, offering a seamless experience for customers to order their favorite pizzas with just a few clicks. The platform features an easy-to-navigate menu, customizable pizza options, and flexible delivery scheduling. With a focus on user-friendly design and smooth functionality, Pizza Fista delivers fresh, delicious pizzas straight to your door.",
    img: "/images/restaurant.png",
    iconLists: ["/images/nextjs.svg", "/images/tailwind.svg", "/images/nestjs.svg", "/images/mongodb.svg"],
    link: "https://restaurant-website-tau-weld.vercel.app/",
  },
  {
    id: 4,
    title: "Kamel Store",
    des: "Kamel Store, an e-commerce website designed for a seamless shopping experience. The platform offers a wide range of products with easy navigation, secure payment options, and fast checkout. With a focus on user-friendly design and smooth functionality, Kamel Store provides customers with an enjoyable and efficient online shopping experience.",
    img: "/images/ecommerce.png",
    iconLists: ["/images/nextjs.svg", "/images/aws.svg", "/images/redux.svg", "/images/prisma.svg"],
    link: "https://kk-nextjs-ecommerce.vercel.app/",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Frontend Developer at Codeway Solution",
    desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "MernStack Devleoper at BrainyBeam InfoTech",
    desc: "Spearheaded the creation of a feature-rich food product application using the MERN Stack",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/kyadapavan",
  },
  {
    id: 2,
    img: "/link.svg",
    link: "https://www.linkedin.com/in/pavankyada/",
  },
  {
    id: 3,
    img: "/twit.svg",
    link: "https://twitter.com/KyadaPavan",
  },
];
