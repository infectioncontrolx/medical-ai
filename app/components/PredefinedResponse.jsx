'use client';
import { useEffect, useState } from 'react';
import { ReactTyped } from 'react-typed';

export default function PredefinedResponse({ questions }) {
  const [suggesstions, setSuggestions] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerBox, setAnswerBox] = useState(false);
  const [suggestionLinks, setSuggestionLinks] = useState(true);
  const questionsToAsk = [];
  questions.forEach((element) => {
    questionsToAsk.push(element.question);
  });

  function filterSuggestions(input, allQuestions) {
    if (!allQuestions) {
      return [];
    }
    const regex = new RegExp(input);
    return allQuestions.filter((question) => regex.test(question));
  }

  useEffect(() => {
    const filtered = filterSuggestions(userInput, questionsToAsk);

    setSuggestions(filtered);
  }, [userInput]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const questionAnswer = questions.find(
      (question) => question.question === userInput
    );

    if (suggesstions.length > 0) {
      setAnswer(questionAnswer.answer);
      setAnswerBox(true);
    }
  };
  const hanleCloseClick = () => {
    setAnswerBox(false);
    setUserInput('');
    setSuggestionLinks(true);
  };
  return (
    <div>
      <form
        className="w-full flex justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your question"
          className="p-4 rounded-xl w-3/5"
        />
        <button
          className="bg-black rounded-xl text-white font-bold text-lg px-4 py-2"
          type="submit"
        >
          Submit
        </button>
      </form>
      <div className=" suggestions  w-full  my-8  ">
        {' '}
        {userInput && (
          <ul
            className={`${
              suggestionLinks
                ? ' w-full gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  '
                : 'hidden'
            }`}
          >
            {suggesstions.length > 0 ? (
              suggesstions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => {
                    setUserInput(suggestion);
                    setSuggestionLinks(false);
                  }}
                  className="shadow-lg shadow-[#c6b4a5] w-full cursor-pointer text-center  py-2 px-3  "
                >
                  <p>{suggestion}</p>
                </li>
              ))
            ) : (
              <li>No Matching Suggestions</li>
            )}
          </ul>
        )}
      </div>

      <div
        className={`${answerBox ? 'block' : 'hidden'} relative  bg-gray-100 "`}
      >
        <span
          className=" h-4 flex items-center justify-center w-4 absolute  text-blacl font-bold  right-1 top-1     rounded-lg cursor-pointer "
          onClick={hanleCloseClick}
        >
          x
        </span>
        <span className="block text-2xl">
          🤵{' '}
          <span className="bg-[#CDE4D6] text-lg px-4 py-2 rounded-lg">
            {userInput}
          </span>
        </span>

        <div className="my-8 p-8 bg-white rounded-lg">
          <ReactTyped strings={[answer]} typeSpeed={40} />
        </div>
      </div>
    </div>
  );
}
