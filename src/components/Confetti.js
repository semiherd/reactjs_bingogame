import React, { useState, useRef, useEffect } from "react";
import Confetti from 'react-confetti'

const ConfettiComp = () => {

   const [height, setHeight] = useState(null);
   const [width, setWidth] = useState(null);
   const confetiRef = useRef(null);

   useEffect(() => {
      setHeight(confetiRef.current.clientHeight);
      setWidth(confetiRef.current.clientWidth);
   }, []);

   return (   
      <Confetti numberOfPieces={150} width={width} height={height} />
   );
};

export default ConfettiComp;