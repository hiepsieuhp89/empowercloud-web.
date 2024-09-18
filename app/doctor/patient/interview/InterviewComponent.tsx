'use client'
import { InterviewHistoryRecord } from '@/gen/proto/v1/interview_pb'
import { interviewList } from '@/server/interview'
import {
  checkListDummyData,
  generateInterviewHistoryDummyData,
} from '@/utils/dummy'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

interface Props {}

const PatientInterviewComponent: FC<Props> = () => {
  const [interviews, setInterviews] = useState<InterviewHistoryRecord[]>([])
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean
  }>({})

  const checklist = checkListDummyData

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _response = await interviewList({
          page: 1,
          userId: 1,
        })
        const _newData = _response.interviews
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      const testData = generateInterviewHistoryDummyData()
      const newData = testData.map((i) => InterviewHistoryRecord.fromJson(i))
      setInterviews(newData)
    }

    fetchData()
  }, [setInterviews])

  const toggleSection = (id: number) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  return (
    <div className="justify-center text-black">
      <h1 className="w-full p-2">問診一覧</h1>
      <div className="">
        {interviews.map((item) => (
          <div
            key={item.id ?? '0'}
            className="my-2 flex w-full flex-col border-b border-gray-100 bg-main-50 px-4 py-2"
          >
            <div
              className="flex justify-between"
              onClick={() => toggleSection(item.id ?? 0)}
            >
              <div>{item.date}</div>
              <div className="px-4">{item.name}</div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-6 ${
                    expandedSections[item.id ?? 0] ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {expandedSections[item.id ?? 0] && (
              <div className="mx-1 flex h-90p justify-center overflow-hidden bg-white">
                <div className="w-full pt-2 text-base text-gray-600">
                  <div className="block w-full">
                    {checklist.content.map((question, i) => (
                      <div
                        key={i}
                        className={`block w-full pt-2 ${i === 0 ? '' : 'border-gray border-t-2 border-dashed'} text-sm`}
                      >
                        <div className="w-full">【{question.type}】</div>
                        <div className="w-full pr-8">{question.question}</div>
                        <div className="mt-2 flex w-full">
                          {question.answerType === 1 && (
                            <p className="mb-2 font-bold">
                              {question.answers[0]}
                            </p>
                          )}
                          {question.answerType === 2 &&
                            question.answers.map((answer, answer_index) => (
                              <button
                                key={answer_index}
                                className="mx-2 mb-2 flex rounded bg-gray-200 px-1 text-xs text-black"
                              >
                                {answer} x
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatientInterviewComponent
