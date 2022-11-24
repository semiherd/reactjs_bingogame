import React from "react";

const ActionButton = ({ text, changeText, onClick, activeDuration }) => {
  
  const clickHandler = (event) => {
    const target = event.target ;
    target.disabled = true;
    onClick(event);
    buttonActive(target);
    target.disabled = false;
  };

  const setStyles = function (element, styles) {
    Object.assign(element.style, styles);
  };

  const buttonActive = function (element) {
    const {
      innerText,
      style: { color, backgroundColor },
    } = element;

    setTimeout(() => {
      setStyles(element, {
        color: color,
        backgroundColor: backgroundColor,
      });
      element.innerText = innerText;
    }, activeDuration);

    setStyles(element, {
      color: "#282c34",
      backgroundColor: "white",
    });
    if (changeText) {
      element.innerText = changeText;
    }
  };

  return <button onClick={clickHandler}>{text}</button>;
};

export default ActionButton;
