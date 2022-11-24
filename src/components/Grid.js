import React from "react";
import "./style/Grid.css";
import Cell from "./Cell";
import chunk from "lodash/chunk";

const Grid= ({data}) => {
  const chunked = chunk(data, 5);
  return (
    <table className="grid" role="grid">
      <tbody>
        {chunked.map((row, index) => (
          <Row data={row} key={index} />
        ))}
      </tbody>
    </table>
  );
};

const Row= ({data}) => {
  return (
    <tr className="row">
      {data.map(({ item,picked,hidden,stamped,toggleStamped }) => (
        <Cell
          key={item.id}
          item={item}
          picked={picked}
          hidden={hidden}
          stamped={stamped}
          toggleStamped={toggleStamped}
        />
      ))}
    </tr>
  );
};

export default Grid;
