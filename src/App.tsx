import { useEffect, useRef, useState } from 'react'
import { categories, difficulty, choiceType, numberOfQuestions } from './shared/data';
import { Endpoint, Questionaire } from './shared/types';
import axios from 'axios';
import { GiCheckMark } from "react-icons/gi";
import { HiMiniXMark } from "react-icons/hi2";
import bgMusic from "./assets/soundtrack/Jeremy Blake - Powerup.mp3";
import wrongAnswerSound from "./assets/soundtrack/wrong-answer.wav";
import correctAnswerSound from "./assets/soundtrack/correct.mp3";
import nextSound from "./assets/soundtrack/next.wav";
import clickSelect from "./assets/soundtrack/clickselect.mp3";

function App() {
  const [baseUrl, setBaseUrl] = useState("");
  const [endpoint, setEndpoint] = useState<Endpoint>({
    limitOfQuestion: 10,
    category: "",
    difficulty: "",
    type: "",
  });
  const [questions, setQuestion] = useState<Questionaire[]>([]);
  const [selectAnswer, setSelectAnswer] = useState<string | null>("");
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [play, setPlay] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>("");

  const soundtrackRef = useRef<HTMLAudioElement>(new Audio(bgMusic));
  const wrongAnsSound = useRef<null | HTMLAudioElement>(null);
  const correctAnsSound = useRef<null | HTMLAudioElement>(null);
  const nextSoundEffect = useRef<null | HTMLAudioElement>(null);
  const selectSoundRef = useRef<null | HTMLAudioElement>(null);

  const regex = /&(amp|quot|#039|Prime|lrm);/gi;

  //console.log(baseUrl);
  //console.log(questions);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;
    setEndpoint(prevValue => ({ ...prevValue, [name]: value }))
    selectSoundRef.current = new Audio(clickSelect);

    if (selectSoundRef.current) {
      selectSoundRef.current.play();
    }
  }

  const fetchQuestionaire = async (): Promise<void> => {
    setPlay(true);
    setIsLoading(true);
    soundtrackRef.current?.play();

    try {
      const response = await axios.get(baseUrl);
      //console.log("response:", response.data.results);
      const mergedData = response.data.results.map((data: Questionaire) => {
        const incorrectWithCorrect = [...data.incorrect_answers, data.correct_answer];
        return {
          ...data,
          incorrect_answers: incorrectWithCorrect,
        };
      });

      //console.log("Incorrect", mergedData);
      setQuestion(mergedData);

    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "There was an error..."
      setIsError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const updateScore = (choiceSelected: string, correctAnswer: string): void => {
    setSelectAnswer(choiceSelected)
    setMsg(null);

    if (choiceSelected === correctAnswer) {
      setScore(prevScore => prevScore + 10);
      correctAnsSound.current?.play();
      setIsCorrect(true);

    } else {
      if (wrongAnsSound.current) {
        wrongAnsSound.current.volume = 0.50;
        wrongAnsSound.current?.play();
        setIsCorrect(false);
      }
    }
  }

  const shuffleChoices = (): void => {
    if (questions[count]) {
      const shuffled = questions[count]?.incorrect_answers.sort(() => Math.random() - 0.5);
      setShuffledChoices(shuffled);
    }
  };

  const goToNextQuestion = () => {
    if (!selectAnswer) {
      setMsg("Please select an answer");
    } else {
      setSelectAnswer(null);
      setCount(count + 1)
      setIsCorrect(null);
      setMsg(null);
      shuffleChoices();
      nextSoundEffect.current?.play();
    }
  }

  const playAgain = () => {
    setCount(0);
    setScore(0);
    setPlay(false);
    setEndpoint({
      limitOfQuestion: 10,
      category: "",
      difficulty: "",
      type: ""
    })

    if (soundtrackRef.current) {
      soundtrackRef.current.currentTime = 20;
      soundtrackRef.current.pause();
    }
  }

  useEffect((): void => {
    setBaseUrl(`https://opentdb.com/api.php?amount=${endpoint.limitOfQuestion}${endpoint.category}${endpoint.difficulty}${endpoint.type}`);
  }, [endpoint])

  useEffect((): void => {
    shuffleChoices();
  }, [count, isLoading]);


  useEffect(() => {
    correctAnsSound.current = new Audio(correctAnswerSound);
    wrongAnsSound.current = new Audio(wrongAnswerSound);
    nextSoundEffect.current = new Audio(nextSound);
  }, [isCorrect]);


  return (
    <main className="relative min-h-screen flex justify-center items-center overflow-hidden main-bg">
      <div className="relative z-10 mx-5 flex flex-col gap-y-10">
        <h1 className="dancing-script-title py-5 drop-shadow-xl text-7xl text-center font-medium bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-400">
          Quizzit
        </h1>
        <div className={`flex flex-col p-8 border rounded-lg transition-all duration-100 md:w-[672px] gap-y-5
              ${selectAnswer ? (
            isCorrect
              ? "bg-gradient-to-bl from-green-400 to-lime-200 border-green-900"
              : " bg-gradient-to-bl to-red-300 from-pink-400 border-red-900"
          ) : "bg-gradient-to-tr from-pink-200/90  to-white/50"}
              `}
        >
          {!play && !isLoading ? (
            <>
              <div className="my-2 flex items-center">
                <label htmlFor="limitOfQuestion" className="bebas-neue-regular text-slate-800 font-medium w-40">Limits Questions</label>
                <select
                  name="limitOfQuestion"
                  id="limitOfQuestion"
                  className="bebas-neue-regular py-2 rounded-md w-2/4 bg-transparent text-slate-700 outline-none"
                  onChange={handleChange}
                >
                  {numberOfQuestions.map((number, index) => (
                    <option
                      key={index}
                      value={number}
                    >
                      {number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-2 flex items-center">
                <label htmlFor="category" className="bebas-neue-regular text-slate-800 font-medium w-40">Select Category</label>
                <select
                  name="category"
                  id="category"
                  className="bebas-neue-regular py-2 rounded-md w-2/4 bg-transparent text-slate-700 outline-none"
                  onChange={handleChange}
                >
                  {categories.map((category, index) => (
                    <option
                      key={index}
                      value={category.paramValue}
                    >
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-2 flex items-center">
                <label htmlFor="difficulty" className="bebas-neue-regular text-slate-800 font-medium w-40">Select Difficulty</label>
                <select
                  name="difficulty"
                  id="difficulty"
                  className="bebas-neue-regular py-2 rounded-md w-2/4 bg-transparent text-slate-700 outline-none"
                  onChange={handleChange}
                >
                  {difficulty.map((mode, index) => (
                    <option
                      key={index}
                      value={mode.modeValue}
                    >
                      {mode.mode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-2 flex items-center">
                <label htmlFor="type" className="bebas-neue-regular text-slate-800 font-medium w-40">Select Type</label>
                <select
                  name="type"
                  id="type"
                  className="bebas-neue-regular py-2 rounded-md w-2/4 bg-transparent text-slate-700 outline-none"
                  onChange={handleChange}
                >
                  {choiceType.map((choice, index) => (
                    <option
                      key={index}
                      value={choice.typeValue}
                    >
                      {choice.type}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="dancing-script-title px-4 py-2 border bg-gradient-to-bl from-rose-500 to-pink-500 text-white rounded-md duration-200 active:bg-gradient-to-r active:to-pink-500 active:from-rose-300 active:scale-95 transition"
                onClick={fetchQuestionaire}
              >
                Play
              </button>
            </>
          ) : (
            <>
              {isLoading && (
                <p className="bebas-neue-regular text-xl text-slate-700">Generating questions...</p>
              )}

              {isError && (
                <>
                  <p className="bebas-neue-regular text-xl text-slate-700">Failed to fetch questionaire</p>
                  <p className="bebas-neue-regular text-xl text-slate-700">{isError}</p>
                  <button
                    className="dancing-script-title text-white text-xl my-2 px-4 py-2 border bg-gradient-to-bl from-rose-500 to-pink-500 rounded-md duration-200 active:bg-gradient-to-r active:to-pink-500 active:from-rose-300 active:scale-95 transition"
                    onClick={() => {
                      setPlay(false)
                      soundtrackRef.current?.pause();
                    }}
                  >
                    Go back and try again
                  </button>
                </>
              )}

              {questions[count] && !isError && (
                <div>
                  <div className="mt-2 flex justify-between flex-wrap">
                    <p className="bebas-neue-regular text-slate-700">Category: {questions[count].category.replace(regex, "")}</p>
                    <p className="bebas-neue-regular text-slate-700">
                      Score: {score}
                    </p>
                  </div>
                  <p className="my-2 bebas-neue-regular text-slate-700">Question: {count + 1}/{endpoint.limitOfQuestion}</p>
                  <h2 className="bebas-neue-regular text-slate-700">{questions[count].question.replace(regex, "")}</h2>
                  <div className="flex flex-col justify-center">
                    {shuffledChoices.map((info) => (
                      <button
                        key={info}
                        className={`bebas-neue-regular text-slate-700 my-2 px-4 py-1  border border-slate-800 rounded-full opacity-75
                            ${selectAnswer === info && selectAnswer !== questions[count].correct_answer
                            ? "opacity-100 text-red-900 bg-red-400/80 border-red-900"
                            : ""
                          }
                            ${selectAnswer === info && selectAnswer === questions[count].correct_answer
                            ? "text-green-900 bg-green-600/80 border-green-940"
                            : ""
                          }
                            ${selectAnswer
                            ? info === questions[count].correct_answer
                              ? "text-green-500 font-bold bg-green-600/80 border-green-600"
                              : ""
                            : ""
                          }
                          `}
                        onClick={() => updateScore(info, questions[count].correct_answer)}
                        disabled={selectAnswer ? true : false}
                      >
                        {info.replace(regex, "")}
                      </button>
                    ))}
                    <p className="text-red-500 font-medium text-lg text-center">{msg}</p>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <button
                      className="dancing-script-title px-4 py-2 shadow-xl bg-gradient-to-bl from-rose-500 to-pink-500 text-white rounded-md duration-200 active:bg-gradient-to-r active:to-pink-500 active:from-rose-300 active:scale-95 transition"
                      onClick={goToNextQuestion}
                    >
                      Next
                    </button>
                    <div className='relative'>
                      <GiCheckMark
                        size={30}
                        className={`absolute -top-3 right-0 text-lime-600 visible transition duration-200 ${selectAnswer && isCorrect ? "opacity-100" : "opacity-0"}`}
                      />
                      <HiMiniXMark
                        size={30}
                        className={`absolute -top-3 right-0 text-red-600 visible transition duration-200  ${selectAnswer && !isCorrect ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {count > endpoint.limitOfQuestion - 1 && (
                <>
                  <h2 className="dancing-script-title text-slate-700 text-center text-3xl">Your Score</h2>
                  <p className="bebas-neue-regular text-slate-700 text-center text-5xl">{score}/{10 * endpoint.limitOfQuestion}</p>
                  <button
                    className="dancing-script-title my-2 ml-2 px-4 py-2 border bg-gradient-to-bl from-rose-500 to-pink-500 text-white rounded-md duration-200 active:bg-gradient-to-r active:to-pink-500 active:from-rose-300 active:scale-95 transition"
                    onClick={playAgain}
                  >
                    Play Again
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default App
