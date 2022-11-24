import React from "react";
import "./style/PickedItem.css";

const PickedItem = ({ data }) => {   
   return (
      <td className="pickedItem">
         {data.text}
      </td>
   );
};

export default PickedItem;