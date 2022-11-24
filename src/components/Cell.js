import React,{useEffect,useState} from "react";
import "./style/Cell.css";
import classNames from "classnames";
import icon from '../assets/bingo.png'

const Cell = ({ item,picked,stamped,hidden,toggleStamped }) => {
   const [bigSize, setBigSize] = useState(false);
   const [divClass, setDivClass] = useState(false);

   async function pickedHandler(){
      setBigSize(true)
   }

   useEffect(()=> {
      pickedHandler()
   },[picked])

   useEffect(()=> {
      if(bigSize)
         setDivClass('transformedStyle')
      else
         setDivClass('normalStyle')
      
   },[bigSize])

   const hiddenStatus= hidden? "cell hidden":"cell"
   let pickStatus=false
   
   if(picked) pickStatus=true
  
   const classes = classNames(hiddenStatus,divClass,{ stamped: stamped },{ picked: pickStatus });
   
   return (
      
         <td className={classes} onClick={toggleStamped}>
            {!hidden? item.text: <img alt="bingo" className="bingo" src={icon} />}
         </td>
    
      );
};

export default Cell;