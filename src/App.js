import { useState } from "react";

import "./App.css";
import Card from "./components/Card";
import CardsList from "./components/CardsList";
import { getLargestTimeUnit, updateCard } from "./utils/helpers";
import { isAfter } from "date-fns";

const CARDS = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    lastReviewed: null,
    interval: 86400000,
    easeFactor: 2.5,
  },
  // {
  //   id: 2,
  //   question: "What year did Christopher Columbus discover America?",
  //   answer: "1492",
  //   lastReviewed: null,
  //   interval: 86400000,
  //   easeFactor: 2.5,
  // },
  // {
  //   id: 3,
  //   question: "What is the largest planet in the solar system?",
  //   answer: "Jupiter",
  //   lastReviewed: null,
  //   interval: 86400000,
  //   easeFactor: 2.5,
  // },
];

function App() {
  const [cards, setCards] = useState(CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredCards = cards?.filter((card) =>
    isAfter(Date.now() + card.interval, Date.now())
  );
  console.log(getLargestTimeUnit(Date.now() + 86400000 - Date.now()));
  const goToNextCard = () => {
    if (currentIndex === cards.length - 1) {
      console.log("No more cards!");
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleUpdateCard = (response) => {
    const card = cards[currentIndex];
    const { ease, interval } = updateCard(
      card.interval,
      card.easeFactor,
      response
    );
    const findIndex = cards.findIndex((c) => c.id === card.id);
    const cardCopy = {
      ...card,
      easeFactor: ease,
      interval,
      lastReviewed: Date.now(),
    };
    setCards((prev) => {
      const prevCopy = [...prev];
      prevCopy[findIndex] = cardCopy;
      return prevCopy;
    });
    console.log(cardCopy);
    goToNextCard();
  };

  return (
    <div className="App">
      {filteredCards.length > 0 ? (
        <Card
          question={filteredCards[currentIndex].question}
          answer={filteredCards[currentIndex].answer}
          onClick={handleUpdateCard}
        />
      ) : null}
      <CardsList cards={cards} />
    </div>
  );
}

export default App;
