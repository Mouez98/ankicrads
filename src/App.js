import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

import "./App.css";
import Card from "./Card";

const fetchCards = async () => {
  const res = await fetch("http://localhost:3500/cards");
  const data = await res.json();
  return data;
};

function formatInterval(intervalInMinutes) {
  const days = Math.floor(intervalInMinutes / 1440); // 1440 minutes in a day
  const hours = Math.floor((intervalInMinutes % 1440) / 60);
  const minutes = intervalInMinutes % 60;

  let formattedString = "";

  if (days > 0) {
    formattedString += `${days} day${days === 1 ? "" : "s"} `;
  }

  if (hours > 0) {
    formattedString += `${hours} hour${hours === 1 ? "" : "s"} `;
  }

  if (minutes > 0) {
    formattedString += `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return formattedString.trim(); // remove trailing space
}

function learningCard(card, recallSpeed) {
  // Update the difficulty level based on recall speed
  card.difficultyLevel = Math.floor(
    card.difficultyLevel +
      0.1 -
      (5 - recallSpeed) * (0.08 + (5 - recallSpeed) * 0.02)
  );

  // Calculate the new interval using the simplified formula
  const newInterval = card.interval >= 600000 ? 86400000 : card.interval * 10;
  card.interval = newInterval;
  return card;
}

function reviewingCard(card, recallSpeed, userResponseCorrectness) {
  card.difficultyLevel =
    card.difficultyLevel +
    0.1 -
    (5 - recallSpeed) * (0.08 + (5 - recallSpeed) * 0.02);

  card.easeFactor = calculateEasinessFactor(
    card.easeFactor,
    userResponseCorrectness * 0.01
  );

  // Calculate the new interval using the simplified formula
  card.interval = card.interval * card.easeFactor;
  return card;
}

function calculateEasinessFactor(previousEF, percentCorrect) {
  let updatedEF;

  if (percentCorrect === 1) {
    updatedEF = previousEF + 0.1 + 0.1;
  } else if (percentCorrect >= 0.75) {
    updatedEF = previousEF + 0.1;
  } else if (percentCorrect >= 0.5) {
    updatedEF = previousEF;
  } else {
    updatedEF = previousEF - 0.15;
  }

  if (updatedEF > 2.5) {
    updatedEF = 2.5;
  } else if (updatedEF < 1.3) {
    updatedEF = 1.3;
  }

  return updatedEF;
}

function App() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0)

  const getPercentageOfCorrectness = (answer, userAnswer) => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    const similarity = stringSimilarity.compareTwoStrings(
      normalizedUserAnswer,
      normalizedAnswer
    );
    const percentage = Math.floor(similarity * 100);

    return percentage;
  };

  const handleReviewCard = async (card) => {
    let promptTime = Math.floor(Date.now() / 1000);
    const response = prompt(card.question);
    let recallSpeed;
    setTimeout(() => {
      const submitTime = Math.floor(Date.now() / 1000);
      recallSpeed = (submitTime - promptTime) / card.duration / 5;
      console.log(`Duration: ${recallSpeed}s`);
    }, 0);

    if (response) {
      const userResponseCorrectness = Math.floor(
        getPercentageOfCorrectness(card.answer, response)
      );

      console.log(userResponseCorrectness);
      card.lastReviewed = Date.now();
      let recallSpeed = userResponseCorrectness / 20;
      if (card.interval < 86400000) {
        learningCard(card, recallSpeed);
      } else {
        reviewingCard(card, recallSpeed, userResponseCorrectness);
      }
      const findIndex = cards.findIndex((c) => card.id === c.id);
      const cardsCopy = [...cards];
      cardsCopy[findIndex] = card;
      setCards(cardsCopy);
      console.log(card);
    } else {
    }
  };

  useEffect(() => {
    fetchCards()
      .then((res) => setCards(res))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <p>Something went wrong</p>;
  return (
    <div className="App">
      {cards.length > 0
        ? cards.map((card) => (<Card key={card.id} title={card.question}/>
            // <div
            //   key={card.question}
            //   className="card"
            //   onClick={() => handleReviewCard(card)}
            // >
            //   <h3>{card.question}</h3>
            //   <p>
            //     Last reviewed: <br />
            //     <span style={{ color: "red" }}>
            //       {card.lastReviewed !== null
            //         ? new Date(card.lastReviewed).toISOString()
            //         : "Has not reviewed yet"}
            //     </span>
            //   </p>
            //   <p>
            //     Interval:
            //     <span style={{ color: "red" }}>
            //       {formatInterval(card.interval / 1000 / 60)}
            //     </span>
            //   </p>
            //   <p>
            //     Ease factor:
            //     <span style={{ color: "red" }}>{card.easeFactor}</span> ease
            //   </p>
            // </div>
          ))
        : null}
    </div>
  );
}

export default App;
