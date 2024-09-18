'use client'
import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import { QuestionAnswer } from '@/gen/proto/v1/questionaire_pb'
import { decryptMessage, sendGoogleLinkToLineUser } from '@/server/chat'
import { clinicList } from '@/server/clinic'
import { storeQuestionaire } from '@/server/questionaire'
import { surveyDummyData } from '@/utils/dummy'
import { StarIcon } from '@heroicons/react/24/outline' // Import Heroicons
import type { Session } from 'next-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

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

interface Props {
  session: Session | null
}

// const basicFormSchema = z.object({
//   feedback: z.string(),
//   rating: z.union([z.number(), z.string()]), // Ensure rating is a number between 1 and 5
// })

const SurveyComponent: React.FC<Props> = ({}) => {
  const router = useRouter()
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormValues>({
    // resolver: zodResolver(basicFormSchema),
    defaultValues: {
      answers: surveyDummyData.content,
    },
  })

  const params = useSearchParams()

  const [hashData, setHashData] = useState<{
    [key: string]: string | number
  } | null>(null)

  useEffect(() => {
    const iv = params.get('iv') ?? ''
    const content = params.get('content') ?? ''
    console.log(iv, content)
    // Fetch data asynchronously
    decryptMessage(iv, content)
      .then((fetchedData) => {
        console.log(fetchedData)
        setHashData(fetchedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [params])

  const [clinic, setClinic] = useState<Clinic>()

  const fetchClinic = useCallback(async () => {
    const list = await clinicList('', 1, 30)
    console.log(list)
    const item = list.clinics.findLast(
      (i) => i.id == (hashData?.c as unknown as number),
    )
    if (item) {
      setClinic(item)
    }
  }, [hashData, setClinic])

  useEffect(() => {
    fetchClinic()
  }, [fetchClinic])

  const onSubmit = async (data: FormValues) => {
    if (!hashData?.i) {
      return
    }
    const postData = surveyDummyData
    postData.clinicId = hashData?.c as unknown as number
    postData.patientId = hashData?.u as unknown as number
    postData.receptionId = hashData?.i as unknown as number
    postData.content = data.answers.map((a) =>
      QuestionAnswer.fromJson({
        type: a.type,
        question: a.question,
        answerType: a.answerType,
        answers: a.answers,
        options: a.options ? a.options : [],
      }),
    )
    postData.questionType = 2
    await storeQuestionaire(postData)
    const totalRate =
      data.answers
        .filter((j) => j.answerType == 3)
        .map((i) => Number(i.answers[0]))
        .reduce((a, b) => a + b, 0) / 5

    console.log(clinic?.googleReviewUrl, clinic)
    if (totalRate >= 8 && hashData?.l && clinic?.googleReviewUrl) {
      sendGoogleLinkToLineUser(
        hashData?.l as string,
        clinic?.googleReviewUrl || 'https://google.com',
      )
    }
    router.push('/')
  }

  const watchedAnswers = watch('answers')

  return (
    <div className="flex flex-col items-center p-6 text-black">
      <h1 className="mb-4 text-3xl font-bold">満足度調査</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        {surveyDummyData.content.map((question, i) => (
          <div
            key={i}
            className={`my-2 block w-full pt-2 ${i === 0 ? '' : 'border-gray border-t-2 border-dashed'} text-sm`}
          >
            <div className="w-full pr-8">{question.question}</div>
            <div className="mt-2 flex w-full">
              {question.answerType === 1 && (
                <Controller
                  name={`answers.${i}.answers`}
                  control={control}
                  render={({ field }) => (
                    <textarea
                      value={field.value[0]}
                      rows={3}
                      onChange={(e) => {
                        const newValue = [e.target.value]
                        field.onChange(newValue)
                      }}
                      className="w-full border px-2"
                    />
                  )}
                />
              )}
              {question.answerType === 3 &&
                question.options?.map((star) => (
                  <StarIcon
                    key={star}
                    className={`size-6 cursor-pointer ${Number(watchedAnswers[i].answers[0]) >= Number(star) ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setValue(`answers.${i}.answers`, [star])}
                  />
                ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          送信
        </button>
      </form>
    </div>
  )
}

export default SurveyComponent
