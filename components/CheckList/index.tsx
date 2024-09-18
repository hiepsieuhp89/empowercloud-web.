import type { Questionaire } from '@/gen/proto/v1/questionaire_pb'
import { QuestionAnswer } from '@/gen/proto/v1/questionaire_pb'
import { storeQuestionaire } from '@/server/questionaire'
import { checkListDummyData } from '@/utils/dummy'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface CheckoutParams {
  isView?: boolean
  questionaire?: Questionaire
  receptionId: number
  clinicId: number
  patientId: number
  updateSucces?: () => void
}

interface QuestionAnswerInput {
  type: string
  question: string
  answerType: number
  answers: string[]
  options?: string[]
}

interface FormValues {
  answers: QuestionAnswerInput[]
}

const CheckoutList: React.FC<CheckoutParams> = ({
  updateSucces,
  receptionId,
  clinicId,
  patientId,
  isView = true,
  questionaire = checkListDummyData,
}) => {
  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      answers: questionaire.content,
    },
  })

  useEffect(() => {
    reset({ answers: questionaire.content })
  }, [questionaire, reset])

  const onSubmit = async (data: FormValues) => {
    const postData = questionaire
    if (questionaire.id) {
      postData.id = questionaire.id
    }
    postData.clinicId = clinicId
    postData.patientId = patientId
    postData.receptionId = receptionId
    postData.content = data.answers.map((a) =>
      QuestionAnswer.fromJson({
        type: a.type,
        question: a.question,
        answerType: a.answerType,
        answers: a.answers,
        options: a.options ? a.options : [],
      }),
    )
    await storeQuestionaire(postData)
    if (updateSucces) {
      updateSucces()
    }
  }

  return (
    <div className="block w-full text-black">
      <form onSubmit={handleSubmit(onSubmit)}>
        {questionaire.content.map((question, i) => (
          <div
            key={i}
            className={`block w-full pt-2 ${i === 0 ? '' : 'border-gray border-t-2 border-dashed'} text-sm`}
          >
            <div className="w-full">【{question.type}】</div>
            <div className="w-full pr-8">{question.question}</div>
            <div className="mt-2 flex w-full">
              {isView && question.answerType === 1 && (
                <p className="mb-2 font-bold">{question.answers[0]}</p>
              )}
              {!isView && question.answerType === 1 && (
                <Controller
                  name={`answers.${i}.answers`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      value={field.value[0]}
                      onChange={(e) => {
                        const newValue = [e.target.value]
                        field.onChange(newValue)
                      }}
                    />
                  )}
                />
              )}
              {isView &&
                question.answerType === 2 &&
                question.answers.map((answer, answer_index) => (
                  <button
                    key={answer_index}
                    className="mx-2 mb-2 flex rounded bg-gray-200 px-1 text-xs text-black"
                  >
                    {answer} x
                  </button>
                ))}
              {!isView &&
                question.answerType === 2 &&
                question.options?.map((option, index) => (
                  <div key={index} className="mx-2">
                    <Controller
                      name={`answers.${i}.answers`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          value={option}
                          checked={field.value?.includes(option)}
                          onChange={(e) => {
                            const newValue = [...field.value!]
                            if (e.target.checked) {
                              newValue.push(option)
                            } else {
                              newValue.splice(newValue.indexOf(option), 1)
                            }
                            field.onChange(newValue)
                          }}
                        />
                      )}
                    />
                    <label>{option}</label>
                  </div>
                ))}
            </div>
          </div>
        ))}
        {!isView && <button type="submit">Submit</button>}
      </form>
    </div>
  )
}

export default CheckoutList
