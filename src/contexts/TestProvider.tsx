import { addDocInCollection, getActiveExam, queryData } from '@/api/exam'
import { useUser } from '@/contexts/UserProvider'
import { LANGUAGES } from '@/utils/const'
import { useLingui } from '@lingui/react/macro'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'

const useContextHook = () => {
  const { t } = useLingui()
  const { user } = useUser()
  const router = useRouter()

  const language = LANGUAGES.find((lang) => lang.value === router.locale)?.label || 'English'

  const [examCompleted, setExamCompleted] = useState(false)
  const [getCertificate, setGetCertificate] = useState(false)
  const [completionData, setCompletionData] = useState<any>({})

  // State management for various UI controls and data
  const [spinner, setSpinner] = useState(true) // Controls loading spinner
  const [start, setStart] = useState(false) // Controls if exam has started
  const [first, setFirst] = useState(true) // Controls initial load
  const [showTimer, setShowTimer] = useState(false) // Controls timer visibility
  const [questions, setQuestions] = useState<any>([]) // Stores exam questions
  const [questionsMap, setQuestionsMap] = useState<any>({}) // Maps questions by ID

  // More state management for exam flow

  // initial state of loading was set to !examCompleted ( removed due to a bug with loading state always setting to true on a welcome page)

  const [loading, setLoading] = useState(false) // Controls loading state

  const [completed, setCompleted] = useState<any>(() => false) // Tracks exam completion
  const [timerExpired, setTimerExpired] = useState(false) // Tracks if timer ran out
  const [totalQuestions, setTotalQuestions] = useState(0) // Total question count
  const [questionCounter, setQuestionCounter] = useState(0) // Current question index
  const [currentQuestion, setCurrentQuestion] = useState<any>({}) // Current question data
  const [answers, setAnswers] = useState<any>({}) // User's answers
  const [examExist, setExamExist] = useState(false) // Checks if exam exists
  const [examTimer, setExamTimer] = useState(0) // Exam time limit
  const [examId, setExamId] = useState('') // Unique exam identifier
  const [createdExamDocId, setCreatedExamDocId] = useState('') // Completed exam document ID
  const [timer, setTimer] = useState<Date | null>(null) // Timer instance
  const [timeUntilRetake, setTimeUntilRetake] = useState<string | null>(null) // Time remaining until retake

  // Initialize welcome page content with translations
  const [welcomeInfo, setWelcomeInfo] = useState<any>({
    title: t`Welcome to the ACPT`,
    examDetails: [t`50 multiple choice questions`, t`1 hour time limit`, t`Official certificate available`],
    secondTitle: t`Things to Remember`,
    price: 0,
    things: [
      t`You must complete this exam in one session`,
      t`You can retake this assessment`,
      t`Certificate will be created once you complete this exam`,
    ],
  })

  // Effect to handle exam completion
  useEffect(() => {
    if (completed) {
      setExamCompleted(true)
      // Remove event listeners for page unload
      window.removeEventListener('beforeunload', alertUser)
      window.removeEventListener('unload', handleTabClosing)
    }
  }, [completed])

  // Add event listeners for page unload when exam starts
  useEffect(() => {
    if (start) {
      window.addEventListener('beforeunload', alertUser)
      window.addEventListener('unload', handleTabClosing)
      return () => {
        window.removeEventListener('beforeunload', alertUser)
        window.removeEventListener('unload', handleTabClosing)
      }
    }
  }, [start])

  // Handler for when user tries to close tab during exam
  const handleTabClosing = async () => {
    await addInCompleteExam()
  }

  // Show warning when user tries to leave page
  const alertUser = (event: any) => {
    event.preventDefault()
    event.returnValue = ''
  }

  // Handle exam completion
  useEffect(() => {
    if (completed && !examCompleted && !timerExpired) {
      addCompletedExam()
    }
  }, [completed])

  // Update timer visibility
  useEffect(() => {
    if (start) {
      if (timer) {
        setShowTimer(true)
      } else {
        setShowTimer(false)
      }
    }
  }, [start])

  // Initialize exam on first load
  useEffect(() => {
    if (first) {
      getExam()
      setFirst(false)
    }
  }, [])

  // Update current question when counter changes
  useEffect(() => {
    const question = questions[questionCounter]
    if (question) {
      setCurrentQuestion(question)
    }
  }, [questionCounter])

  // Function to check if user can retake exam (24-hour restriction)
  const canRetakeExam = async () => {
    try {
      const resp = await queryData('exams_completed', 'user_id', user.id as string)

      if (resp.status && resp.fullData.length > 0) {
        // Sort by completion time (most recent first)
        const sortedExams = resp.fullData.sort((a: any, b: any) => b.completed_at - a.completed_at)

        const currentTime = new Date().getTime()
        const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        // Filter exams within the last 24 hours
        const examsInLast24Hours = sortedExams.filter((exam: any) => {
          const timeDifference = currentTime - exam.completed_at
          return timeDifference < twentyFourHours
        })

        // If less than 2 exams in the last 24 hours, allow retake
        if (examsInLast24Hours.length < 2) {
          setTimeUntilRetake(null)
          return true
        }

        // If exactly 2 exams in the last 24 hours, user must wait until the oldest one is 24+ hours old
        if (examsInLast24Hours.length >= 2) {
          // Get the oldest exam in the 24-hour window (should be the last one in the filtered array)
          const oldestExamInWindow = examsInLast24Hours[examsInLast24Hours.length - 1]
          const oldestExamTime = oldestExamInWindow.completed_at
          const timeSinceOldest = currentTime - oldestExamTime

          if (timeSinceOldest >= twentyFourHours) {
            // 24 hours have passed since the oldest exam, allow retake
            setTimeUntilRetake(null)
            return true
          } else {
            // Calculate time remaining until 24 hours have passed since the oldest exam
            const timeRemaining = twentyFourHours - timeSinceOldest
            const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000))
            const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))

            setTimeUntilRetake(`${hoursRemaining}h ${minutesRemaining}m`)
            return false
          }
        }
      }

      // No previous attempts found, allow retake
      setTimeUntilRetake(null)
      return true
    } catch (error) {
      console.error('Error checking retake eligibility:', error)
      return false
    }
  }

  // Function to record incomplete exam
  const addInCompleteExam = async () => {
    const score = 0
    await addDocInCollection(
      'exams_completed',
      {
        score,
        user_id: user.id,
        completed_at: new Date().getTime(),
        status: 'Incomplete',
        payment: 'Unpaid',
        language,
        examId,
      },
      user.examsCompleted,
      user.examsAttempted,
    )
  }

  // Function to record completed exam and calculate score
  const addCompletedExam = async () => {
    const totalQuestions = questions.length
    let correctAnswers = 0
    Object.entries(answers).forEach(([key, value]) => {
      const question = questionsMap[key]
      const correctAns = question[question.correctAnswer]
      if (value === correctAns) {
        correctAnswers++
      }
    })

    const score = (correctAnswers / totalQuestions) * 100
    const hasPassed = score >= 75 // Track pass/fail

    localStorage.setItem('completionData', JSON.stringify({}))
    setCompletionData({
      score,
      examName: welcomeInfo.title,
      price: welcomeInfo.price,
      hasPassed,
    })

    localStorage.setItem(
      'completionData',
      JSON.stringify({
        score,
        examName: welcomeInfo.title,
        price: welcomeInfo.price,
        hasPassed,
      }),
    )

    const resp = await addDocInCollection(
      'exams_completed',
      {
        score,
        user_id: user.id,
        completed_at: new Date().getTime(),
        status: 'Complete',
        passed: hasPassed,
        payment: 'Unpaid',
        language,
        examId,
      },
      user.examsCompleted,
      user.examsAttempted,
    )

    if (resp.status) {
      setLoading(false)
    }

    if (resp.docId) {
      setCreatedExamDocId(resp.docId)
    }
  }

  // Functions to handle exam retake and certificate generation
  const retakeExam = async () => {
    // Check if user can retake (24-hour sliding window for 2 tests)
    const canRetake = await canRetakeExam()
    localStorage.setItem('isShowResultScreen', 'false')
    if (!canRetake) {
      showNotification({
        message: t`You have reached the maximum of 2 exam attempts in 24 hours. Please wait before trying again.`,
        color: 'red',
      })

      if (timeUntilRetake) {
        showNotification({
          message: t`Time remaining: ${timeUntilRetake}`,
          color: 'blue',
        })
      }
      return
    }

    // Reset all exam states for retake
    setStart(false)
    setQuestionCounter(0)
    setShowTimer(false)
    setExamCompleted(false)
    setTimer(null)
    setTimerExpired(false)
    setAnswers({})
    setCompleted(false)
    setCreatedExamDocId('')
    setCompletionData({})

    // Clear session storage
    sessionStorage.removeItem('examCompleted')
    sessionStorage.removeItem('completionData')

    // Fetch exam again. getExam() drives its own `spinner`; `loading` must be cleared or
    // TestPage renders PageLoader forever.
    getExam()
    setLoading(false)
  }

  const getCert = () => {
    setGetCertificate(true)
    setExamCompleted(false)
    // setCompleted(false)
  }

  const startExam = async () => {
    const canTake = await canRetakeExam()
    localStorage.setItem('isShowResultScreen', 'false')

    if (!canTake) {
      showNotification({
        message: t`You have reached the maximum of 2 exam attempts in 24 hours. Please wait before trying again.`,
        color: 'red',
      })

      if (timeUntilRetake) {
        showNotification({
          message: t`Time remaining: ${timeUntilRetake}`,
          color: 'blue',
        })
      }
      return
    }

    setStart(true)
  }

  // Function to fetch exam data
  const getExam = async () => {
    try {
      setSpinner(true)
      const resp = await getActiveExam(language)
      setSpinner(false)
      if (resp.status && resp.fullData.length > 0) {
        setExamExist(true)
        const data = resp.data
        setExamId(data.docId)
        if (data.timer && Number(data.timer) > 0) {
          const timerFetched = Number(data.timer)
          setExamTimer(timerFetched)
          const timeInSeconds = timerFetched * 60
          const time = new Date()
          time.setSeconds(time.getSeconds() + timeInSeconds)
          setTimer(time)
        }
        setWelcomeInfo({
          title: data.title,
          examDetails: [data.exam_detail_1 || '', data.exam_detail_2 || '', data.exam_detail_3 || ''].filter(Boolean),
          secondTitle: data.second_title,
          things: [data.thing_rem_1 || '', data.thing_rem_2 || '', data.thing_rem_3 || ''].filter(Boolean),
          price: data.price || 0,
        })
        getQuestions(data)
      } else {
        setExamExist(false)
      }
    } catch (e: any) {
      console.log(e)
    }
  }

  // Function to fetch and randomize questions
  const getQuestions = async (data: any) => {
    const noOfQuestions: string | number = Number(data.number_of_questions) || 0
    const lang = data.language || 'English'
    const resp = await queryData('exams_questions', 'language', lang)
    if (resp.status && resp.fullData.length > 0) {
      let questionsArr = resp.fullData
      questionsArr = questionsArr.sort(() => 0.5 - Math.random())
      const newArr = questionsArr.slice(0, noOfQuestions)
      const obj = {}
      newArr.forEach((ques: any) => {
        // @ts-ignore
        obj[ques.docId] = ques
      })

      setQuestionsMap(obj)
      setQuestions(newArr)
      setCurrentQuestion(newArr[0])
      setTotalQuestions(Object.keys(obj).length)
    }
  }

  // Check if user came from certificate page
  useEffect(() => {
    if (getCertificate) {
      getCert()
    }
  }, [])

  return {
    spinner,
    setSpinner,
    start,
    setStart,
    first,
    setFirst,
    showTimer,
    setShowTimer,
    questions,
    setQuestions,
    questionsMap,
    setQuestionsMap,
    welcomeInfo,
    setWelcomeInfo,
    examCompleted,
    setExamCompleted,
    getCertificate,
    setGetCertificate,
    completionData,
    setCompletionData,
    loading,
    setLoading,
    completed,
    setCompleted,
    timerExpired,
    setTimerExpired,
    totalQuestions,
    setTotalQuestions,
    questionCounter,
    setQuestionCounter,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswers,
    examExist,
    setExamExist,
    examTimer,
    setExamTimer,
    examId,
    setExamId,
    createdExamDocId,
    setCreatedExamDocId,
    timer,
    setTimer,
    retakeExam,
    timeUntilRetake,
    startExam,
  }
}

type StorageHook = ReturnType<typeof useContextHook>

const TestContext = createContext<StorageHook>({} as any)

type Props = {
  children?: ReactNode
}

const TestProvider: FC<Props> = ({ children }) => {
  const props = useContextHook()
  return <TestContext.Provider value={props}>{children}</TestContext.Provider>
}

export const useTest = () => useContext(TestContext)

export default TestProvider
