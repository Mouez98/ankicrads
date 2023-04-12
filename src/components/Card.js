import React, { useState } from "react";
import "./Card.css";

const Card = ({ question, answer = "test", onClick }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleButtonClick = (difficulty) => {
    // handle button click logic here
    onClick(difficulty);
    setShowAnswer(false);
  };

  return (
    <div className="card">
      <div className="card-title">{question}</div>
      <div className="card-content">
        {showAnswer ? (
          <div className="card-answer">{answer}</div>
        ) : (
          <button className="show-answer-button" onClick={handleShowAnswer}>
            Show Answer
          </button>
        )}
      </div>
      {showAnswer && (
        <div className="card-buttons">
          <button
            className="again-button"
            onClick={() => handleButtonClick("again")}
          >
            Again
          </button>
          <button
            className="hard-button"
            onClick={() => handleButtonClick("hard")}
          >
            Hard
          </button>
          <button
            className="normal-button"
            onClick={() => handleButtonClick("normal")}
          >
            Normal
          </button>
          <button
            className="easy-button"
            onClick={() => handleButtonClick("easy")}
          >
            Easy
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
