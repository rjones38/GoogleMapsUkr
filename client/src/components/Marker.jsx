import React from "react";

const MyMarker = ({ lat, lng, text, $hover, tooltip}) => {
  const handleClick = () => {
    console.log(`You clicked on ${tooltip}`);
    alert(tooltip)
  };

  return (
    <div className={$hover ? "circle hover" : "circle"} onClick={handleClick}>
      <span className="circleText" title={tooltip}>
        {text}
      </span>
    </div>
  );
};

export default MyMarker;