import React from "react";
import { formatDistanceToNow } from "date-fns";
import { getLargestTimeUnit } from "../utils/helpers";
import "./CardsList.css";

function QuestionList({ cards }) {
  return (
    <ul className="question-list">
      {cards.map((q) => (
        <li key={q.id} className="question-item">
          <h3>{q.question}</h3>
          <div>
            <strong>Answer:</strong> {q.answer}
          </div>
          <div>
            <strong>Last reviewed:</strong>
            {q.lastReviewed
              ? formatDistanceToNow(new Date(q.lastReviewed))
              : "Never"}
          </div>
          <div>
            <strong>Interval:</strong>
            {getLargestTimeUnit(Date.now() + q.interval - Date.now()).fullTime}
          </div>
          <div>
            <strong>Ease factor:</strong> {q.easeFactor}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
