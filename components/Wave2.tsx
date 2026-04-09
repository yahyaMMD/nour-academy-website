import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const WaveContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: linear-gradient(180deg, #e3f2fd, #ffffff);
`;

const WaveStyle = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
`;

const PathStyle = styled(motion.path)`
  fill-opacity: 0.7;
`;

const Wave2 = () => {
  return (
    <WaveContainer>
      {/* Background Wave */}
      <WaveStyle viewBox="0 0 1440 363" xmlns="http://www.w3.org/2000/svg">
        <PathStyle
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          d="M0 120C120 150 240 90 360 120C480 150 600 210 720 240C840 270 960 240 1080 210C1200 180 1320 150 1440 120V363H0V120Z"
          fill="url(#gradient1)"
        />
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#768cff" />
            <stop offset="100%" stopColor="#82e9de" />
          </linearGradient>
        </defs>
      </WaveStyle>

      {/* Foreground Wave */}
      <WaveStyle viewBox="0 0 1440 363" xmlns="http://www.w3.org/2000/svg">
        <PathStyle
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          d="M0 180C120 150 240 210 360 240C480 270 600 240 720 180C840 120 960 90 1080 120C1200 150 1320 210 1440 240V363H0V180Z"
          fill="url(#gradient2)"
        />
        <defs>
          <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64b5f6" />
            <stop offset="100%" stopColor="#f06292" />
          </linearGradient>
        </defs>
      </WaveStyle>
    </WaveContainer>
  );
};

export { Wave2 };
