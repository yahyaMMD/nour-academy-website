import React from "react";
import style from "../styles/skills.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

const Skill = ({ img, name }) => {
  const cardAnimate = {
    offscreen: { y: 0 },
    onView: {},
    onscreen: {
      y: -20,
      transition: { duration: 0.08 },
    },
  };
  const imgAnimate = {
    offscreen: { y:+30,opacity:0 },
    onscreen: {
      y: 0,
      opacity:1,
      transition: { duration: 1},
    },
  };
  return (
    <motion.div
      className={style.card}
      initial={"offscreen"}
      whileInView={"onView"}
      whileHover={"onscreen"}
      variants={cardAnimate}
    >
      <div className={`skills-card ${style.skillDiv}`}>
        <motion.div
          initial={"offscreen"}
          whileInView={"onscreen"}
          variants={imgAnimate}
        >
          <div className={`relative ${style.img}`}>
            <Image className="object-contain" src={img} alt="" fill />
          </div>
        </motion.div>
        <h3 className={`skills-card-name ${style.name}`}>{name}</h3>
      </div>
    </motion.div>
  );
};

export default Skill;
