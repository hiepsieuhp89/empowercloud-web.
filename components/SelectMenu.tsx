import type { MenuItem } from '@/gen/proto/v1/menu_pb'
import type { ReceptionFormInput } from '@/utils/type'
import React, { useEffect, useMemo, useState } from 'react'
import type { UseFormRegister } from 'react-hook-form'

interface InputParams {
  menuId: string
  defaultMenuId?: string
  setMenuId: (value: string) => void
  validMenus: MenuItem[]
  register: UseFormRegister<ReceptionFormInput>
}

const MenuSelect: React.FC<InputParams> = ({
  setMenuId,
  defaultMenuId,
  validMenus,
  register,
}) => {
  // State variables to manage selected values
  const [selectedExamCategory, setSelectedExamCategory] = useState<string>('')
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<string>('')

  const [exams, setExams] = useState<MenuItem[]>([])
  useEffect(() => {
    const fetchExamData = async () => {
      setExams(validMenus)
      if (defaultMenuId) {
        const menuItem = validMenus.findLast(
          (i) => i.id == Number(defaultMenuId),
        )
        if (menuItem) {
          setSelectedExamCategory(menuItem.examinationCategory)
          setSelectedMajorCategory(menuItem.majorCategory)
          setMenuId(defaultMenuId)
        }
      }
    }

    fetchExamData()
  }, [
    setExams,
    defaultMenuId,
    validMenus,
    setSelectedExamCategory,
    setMenuId,
    setSelectedMajorCategory,
  ])

  const examinationCategories: string[] = useMemo(() => {
    const listExamps = exams.map((i) => i.examinationCategory)
    return Array.from(new Set(listExamps))
  }, [exams])

  const majorCategories: string[] = useMemo(() => {
    const listMajors = exams
      .filter((i) => i.examinationCategory == selectedExamCategory)
      .map((i) => i.majorCategory)
    return Array.from(new Set(listMajors))
  }, [exams, selectedExamCategory])

  const minorCategories: MenuItem[] = useMemo(() => {
    return exams.filter(
      (i) =>
        i.examinationCategory == selectedExamCategory &&
        i.majorCategory == selectedMajorCategory,
    )
  }, [exams, selectedExamCategory, selectedMajorCategory])

  return (
    <div className="w-full rounded border bg-white p-2">
      {/* Select for Diagnosis Category */}
      <select
        value={selectedExamCategory}
        className="w-48 truncate"
        onChange={(e) => {
          setSelectedExamCategory(e.target.value)
          setSelectedMajorCategory('')
          setMenuId('')
        }}
      >
        <option value="">診察カテゴリを選択</option>
        {examinationCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Select for Major Category */}
      <select
        className="w-48 truncate"
        value={selectedMajorCategory}
        onChange={(e) => {
          setSelectedMajorCategory(e.target.value)
          setMenuId('')
        }}
        // disabled={!selectedExamCategory}
      >
        <option value="">大カテゴリを選択</option>
        {majorCategories.map((majorCategory) => (
          <option key={majorCategory} value={majorCategory}>
            {majorCategory}
          </option>
        ))}
      </select>

      {/* Select for Minor Category */}
      <select
        className="w-72 truncate"
        {...register('examinationId')}
        onChange={(e) => {
          setMenuId(e.target.value)
          register('examinationId').onChange(e)
        }}
        // defaultValue={menuId}
        // disabled={!selectedMajorCategory}
        // name="examinationId"
      >
        <option value="">小カテゴリを選択</option>
        {minorCategories.map((minorCategory) => (
          <option key={minorCategory.id} value={minorCategory.id}>
            {minorCategory.minorCategory}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MenuSelect
