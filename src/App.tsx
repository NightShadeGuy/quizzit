import { useEffect, useState } from 'react'
import { categories, difficulty, choiceType } from './shared/data';
import { Endpoint, Questionaire } from './shared/types';
import axios from 'axios';
import { GiCheckMark } from "react-icons/gi";
import { HiMiniXMark } from "react-icons/hi2";

function App() {
  const [baseUrl, setBaseUrl] = useState("");
  const [endpoint, setEndpoint] = useState<Endpoint>({
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

  const regex = /&(amp|quot|#039|Prime|lrm);/gi;

  //console.log(baseUrl);
  //console.log(questions);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;
    setEndpoint(prevValue => ({ ...prevValue, [name]: value }))
  }

  const fetchQuestionaire = async (): Promise<void> => {
    setPlay(true);
    setIsLoading(true);
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

  useEffect((): void => {
    setBaseUrl(`https://opentdb.com/api.php?amount=10${endpoint.category}${endpoint.difficulty}${endpoint.type}`);
  }, [endpoint])

  const updateScore = (choiceSelected: string, correctAnswer: string): void => {
    setSelectAnswer(choiceSelected)
    setMsg(null);

    if (choiceSelected === correctAnswer) {
      setScore(prevScore => prevScore + 10);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }

  const shuffleChoices = (): void => {
    if (questions[count]) {
      const shuffled = questions[count]?.incorrect_answers.sort(() => Math.random() - 0.5);
      setShuffledChoices(shuffled);
    }
  };

  useEffect((): void => {
    shuffleChoices();
  }, [count, isLoading]);



  return (
    <>
      <div>
        <h1 className=" text-5xl text-center my-10 font-medium">Quizzit</h1>
        <div className={`flex flex-col p-4  border border-black rounded-md  transition duration-150  xs:1/4 xs:mx-4 lg:w-1/2 lg:mx-auto 
            ${selectAnswer ? (
            isCorrect
              ? "bg-green-200 border-green-900"
              : "bg-red-200 border-red-900"
          ) : "bg-white"}
            `}
        >
          {!play && !isLoading ? (
            <>
              <div className="my-2 flex items-center">
                <p className='w-40'>
                  <label htmlFor='category' className=" w-full">Select Category</label>
                </p>
                <select
                  name="category"
                  id="category"
                  className="py-2 rounded-md w-2/4"
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
                <p className='w-40'>
                  <label htmlFor='difficulty' className="">Select Difficulty</label>
                </p>
                <select
                  name="difficulty"
                  id="difficulty"
                  className="py-2 rounded-md w-2/4"
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
                <p className='w-40'>
                  <label htmlFor='type' className="">Select Type</label>
                </p>
                <select
                  name="type"
                  id="type"
                  className="py-2 rounded-md w-2/4"
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
                className="px-4 py-2 border bg-black text-white rounded-md active:bg-white transition duration-200 active:text-black active:border-black"
                onClick={fetchQuestionaire}
              >
                Play
              </button>
            </>
          ) : (
            <>
              {isLoading && (
                <p>Generating questions...</p>
              )}

              {isError && (
                <>
                  <p>Failed to fetch questionaire</p>
                  <p>{isError}</p>
                  <button
                    className="my-2 px-4 py-2 border bg-black text-white rounded-md transition duration-200 active:bg-white active:text-black active:border-black"
                    onClick={() => setPlay(false)}
                  >
                    Go back
                  </button>
                </>
              )}

              {questions[count] && !isError && (
                <div>
                  <div className='mt-2 flex justify-between flex-wrap'>
                    <p>Category: {questions[count].category.replace(regex, "")}</p>
                    <p>
                      <span className="pr-3">{count + 1}/10</span>
                      Score: {score}
                    </p>
                  </div>
                  <p className="my-2">Question #{count + 1}</p>
                  <h2>{questions[count].question.replace(regex, "")}</h2>
                  <div className="flex flex-col justify-center">
                    {shuffledChoices.map((info) => (
                      <button
                        key={info}
                        className={`my-2 px-4 py-1  bg-white text-black border border-black rounded-full opacity-75
                          ${selectAnswer === info && selectAnswer !== questions[count].correct_answer
                            ? "opacity-100 text-red-900 bg-red-600/50 border-red-900"
                            : ""
                          }
                          ${selectAnswer === info && selectAnswer === questions[count].correct_answer
                            ? "text-green-900 bg-green-600/50 border-green-900"
                            : ""
                          }
                          ${selectAnswer
                            ? info === questions[count].correct_answer
                              ? "text-green-500 font-bold bg-green-300 border-green-600"
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

                  <div className="flex flex-row items-center  justify-between">
                    <button
                      className="my-2 ml-2 px-4 py-2 border bg-black text-white rounded-md transition duration-200 active:bg-white active:text-black active:border-black"
                      onClick={() => {
                        if (!selectAnswer) {
                          setMsg("Please select an answer");
                        } else {
                          setSelectAnswer(null);
                          setCount(count + 1)
                          setIsCorrect(null);
                          setMsg(null);
                          shuffleChoices();
                        }
                      }}
                    >
                      Next
                    </button>

                    {selectAnswer ?
                      isCorrect
                        ? (<GiCheckMark className=" text-lime-600" size={30} />)
                        : (<HiMiniXMark className="text-red-600" size={30} />)
                      : null
                    }
                  </div>
                </div>
              )}

              {count > 9 && (
                <>
                  <h2 className=" text-center text-3xl">Your Score</h2>
                  <p className="text-center text-5xl">{score}/100</p>
                  <button
                    className="my-2 ml-2 px-4 py-2 border bg-black text-white rounded-md transition duration-200 active:bg-white active:text-black active:border-black"
                    onClick={() => {
                      setCount(0);
                      setScore(0);
                      setPlay(false);
                      setEndpoint({ category: "", difficulty: "", type: "" })
                    }}
                  >
                    Play Again
                  </button>
                </>
              )}

            </>
          )}

        </div>
      </div>
    </>
  )
}

export default App
