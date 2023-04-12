import stringSimilarity from "string-similarity";

const oneDay = 860400;

export function getLargestTimeUnit(milliseconds) {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  const units = [
    { label: "day", divisor: DAY },
    { label: "hour", divisor: HOUR },
    { label: "minute", divisor: MINUTE },
    { label: "second", divisor: SECOND },
  ];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const value = Math.floor(milliseconds / unit.divisor);
    if (value > 0) {
      // return `${value} ${unit.label}${value === 1 ? "" : "s"}`;
      return {
        fullTime: `${value} ${unit.label}${value === 1 ? "" : "s"}`,
        value: value,
      };
    }
  }

  return "0 seconds";
}

export function updateCard(_interval, _ease, response) {
  let interval;
  let ease = _ease;
  //   if (response) {
  //     // if the user successfully remembered the card, increase the interval based on the ease factor
  //     interval = Math.round(_interval * ease);
  //   } else {
  //     // if the user didn't remember the card, reset the interval to its initial value
  //     interval = oneDay;
  //   }

  // adjust the ease factor based on the user's response
  if (response === "hard") {
    ease -= 0.15;
    interval = Math.round(_interval * ease);
  } else if (response === "normal") {
    console.log({ _ease });
    console.log({ ease });
    interval = Math.round(_interval * _ease);
    console.log({ _interval });
    console.log({ interval });
  } else if (response === "easy") {
    ease += 0.15;
    interval = Math.round(_interval * ease * 1.3);
  } else if (response === "again") {
    // interval = 1;
    ease += 0.15;
  }

  // clamp the interval to a minimum of 1 day
  //   if (interval < oneDay) {
  //     interval = oneDay;
  //   }
  // clamp the ease factor between 1.3 and 2.5
  if (ease < 1.3) {
    ease = 1.3;
  } else if (ease > 2.5) {
    ease = 2.5;
  }

  return { interval, ease };
}

export function formatInterval(intervalInMinutes) {
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

export function calculateEasinessFactor(previousEF, percentCorrect) {
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
export function learningCard(card, recallSpeed) {
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

export function reviewingCard(card, recallSpeed, userResponseCorrectness) {
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

export const getPercentageOfCorrectness = (answer, userAnswer) => {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedAnswer = answer.trim().toLowerCase();

  const similarity = stringSimilarity.compareTwoStrings(
    normalizedUserAnswer,
    normalizedAnswer
  );
  const percentage = Math.floor(similarity * 100);

  return percentage;
};

export const handleReviewCard = async (card, cards, setCards) => {
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
