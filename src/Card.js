import React from "react";
import "./Card.css";

const Card = ({ title, onEasyClick, onNormalClick, onHardClick, onAgainClick }) => {
  const handleEasyClick = () => {
    onEasyClick();
  };

  const handleNormalClick = () => {
    onNormalClick();
  };

  const handleHardClick = () => {
    onHardClick();
  };

  const handleAgainClick = () => {
    onAgainClick();
  };

  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-buttons">
        <button className="easy-button" onClick={handleEasyClick}>Easy</button>
        <button className="normal-button" onClick={handleNormalClick}>Normal</button>
        <button className="hard-button" onClick={handleHardClick}>Hard</button>
        <button className="again-button" onClick={handleAgainClick}>Again</button>
      </div>
    </div>
  );
};

export default Card;