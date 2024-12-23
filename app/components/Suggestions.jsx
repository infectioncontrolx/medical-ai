"use client";
import { ReactTyped } from "react-typed";
import styles from "./loader.module.css";
import { Message, experimental_useAssistant as useAssistant } from "ai/react";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Image from "next/image";

export default function Suggestions({ questions }) {
  const { status, messages, submitMessage, input, handleInputChange, error } =
    useAssistant({
      api: "/api/assistant",
    });
  const [suggesstions, setSuggestions] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerBox, setAnswerBox] = useState(false);
  const [suggestionLinks, setSuggestionLinks] = useState(true);
  const questionsToAsk = [];
  questions.forEach((element) => {
    questionsToAsk.push(element.question);
  });
  const inputRef = useRef(null);
  useEffect(() => {
    if (status === "awaiting_message") {
      inputRef.current?.focus();
    }
  }, [status]);

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

    if (!userInput) {
      return;
    }

    const questionAnswer = questions.find(
      (question) => question.question === userInput
    );
    if (suggesstions.length > 0) {
      setAnswer(questionAnswer.answer);
      setAnswerBox(true);
    } else {
      submitMessage(userInput);
    }
  };
  const hanleCloseClick = () => {
    setAnswerBox(false);
    setUserInput("");
    setSuggestionLinks(true);
  };
  return (
    <div className="w-4/5   h-4/5 py-8 flex items-center  justify-start flex-col ">
      <form
        className="w-full flex justify-center gap-4"
        onSubmit={submitMessage}
      >
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
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
        {" "}
        {userInput && (
          <ul
            className={`${
              suggestionLinks
                ? " w-full gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  "
                : "hidden"
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

     
        <div className="">
        <span
          className=" h-4 flex items-center justify-center w-4 absolute  text-blacl font-bold  right-1 top-1     rounded-lg cursor-pointer "
          onClick={hanleCloseClick}
        >
          x
        </span>
        <span className="block text-2xl">
          🤵{" "}
          <span className="bg-[#CDE4D6] text-lg px-4 py-2 rounded-lg">
            {userInput}
          </span>
        </span>

        <div className="my-8 p-8 bg-white rounded-lg">
          <ReactTyped strings={[answer]} typeSpeed={40} />
        </div>
        </div>
       
          <div className=" Ai  my-4 flex flex-col  ">
            <div>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className=" py-8 bg-gray-100 rounded-lg  relative "
                >
                  <>
                    <div className="flex gap-2 items-center  mb-10      ">
                      <span className="text-3xl flex ">
                        {m.role === "user" && (
                          <div className="absolute right-10  sm:right-0 flex items-center h-fit mb-4 ">
                            <span
                              className="bg-[#CDE4D6]  rounded-l-lg rounded-tr-xl
                         text-[18px] font-semibold px-8 py-0.5"
                            >
                              {m.content}
                            </span>
                            🤵
                          </div>
                        )}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center  justify-start mt-16   w-fit sm:mt-8  pl-4 ">
                        <div className="flex items-center w-fit relative ">
                          {status === "in_progress" ? (
                            <Image
                              src="/Ai.png"
                              alt=""
                              width={40}
                              height={40}
                              className="h-10 w-10"
                            />
                          ) : (
                            ""
                          )}
                          {status === "in_progress" ? (
                            <span
                              className={`${styles.loader} absolute left-3 bottom-0`}
                            ></span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      {m.role === "assistant" && (
                        <p
                          style={{ direction: "rtl" }}
                          className="whitespace-pre-wrap ml-8 w-4/5 bg-white self-center  p-10"
                        >
                          {m.content}
                        </p>
                      )}
                    </div>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
     
   
  );
}
