"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data/";
import { PinContainer } from "./ui/Pin";
import Image from "next/image";

const RecentProjects = () => {
  return (
    <div>
      <div id="projects">
        <h1 className="text-center text-5xl font-extrabold text-dentalPurple mb-4" > Our Latest Projects </h1>
        <h2 className="text-center text-xl font-medium text-gray-600">Explore our innovative solutions that drive success and elevate businesses</h2>
        <div className="flex flex-wrap items-center justify-center sm:gap-16 ">
          {projects.map((item) => (
            <div
              className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-[70vh] w-[80vw]"
              key={item.id}
            >
              <PinContainer
                title={item.title}
                href="https://twitter.com/mannupaaji"
              >
                <div className="relative flex items-center justify-center sm:w-96 w-[90vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-4">
                  <Image
                  fill
                    src={item.img}
                    alt="cover"
                    className="object-contain rounded-sm"
                  />
                </div>

                <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                  {item.title}
                </h1>

                <p
                  className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                  style={{
                    color: "#BEC1DD",
                    margin: "1vh 0",
                  }}
                >
                  {item.des}
                </p>

                <div className="flex items-center justify-between mt-7 mb-3">
                  <div className="flex items-center">
                    {item.iconLists.map((icon, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-full lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        <img src={icon} alt="icon5" className="p-2" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center items-center">
                    <a
                      className="flex lg:text-xl md:text-xs text-sm text-purple"
                      href={item.link}
                      target="_blank"
                    >
                      Check Live Site
                    </a>
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </div>
                </div>
              </PinContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentProjects;
