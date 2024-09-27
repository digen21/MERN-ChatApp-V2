import React, { useRef } from "react";
import Lottie from "react-lottie-player";

import animationData from "@/assets/lottie-json.json";

interface Props {
  height?: number;
  width?: number;
  fontClass?: string;
  text1?: string;
  text2?: string;
}

const defaultClass = `text-opacity-80 text-white flex text-center flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300`;

const LottieComp: React.FC<Props> = ({
  height = 200,
  width = 200,
  text1 = `Welcome to`,
  text2 = `Chat-App 2.0`,
  fontClass = defaultClass,
}: Props) => {
  const lottieRef = useRef(null);

  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        ref={lottieRef}
        style={{ width, height }}
        animationData={animationData}
        loop
        play
      />

      <div className={fontClass}>
        <h3 className="">
          Hi<span className="text-purple-500">! </span>
          {text1} <span className="text-purple-500">{text2}</span>
          {/* <span className="text-purple-500">.</span> */}
        </h3>
      </div>
    </div>
  );
};

export default LottieComp;
