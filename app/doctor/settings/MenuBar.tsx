'use client'
import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import { clinicList } from '@/server/clinic'
import { storeStaff } from '@/server/doctor'
import type { SessionProps, SessionUser } from '@/utils/type'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

const SettingMenuBarComponent: React.FC<SessionProps> = ({ session }) => {
  const user = useMemo(() => {
    return session?.user as SessionUser
  }, [session])
  const pathname = usePathname()

  const [clinics, setClinics] = useState<Clinic[]>([])
  const [clinicId, setClinicId] = useState<number>(user.clinic_id)

  const buttonData: { href: string; text: string }[] = [
    { href: '/doctor/settings/info', text: '基本情報' },
    // { href: '/doctor/settings/users', text: 'スタッフ管理' },
    { href: '/doctor/settings/staff', text: 'スタッフ管理' },
    // { href: '/doctor/settings/staffrole', text: 'スタッフ区分管理' },
    { href: '/doctor/settings/menu', text: '診察メニュー管理' },
    // { href: '/doctor/settings/template', text: 'テンプレ管理' },
    { href: '/doctor/settings/label', text: 'ラベル管理' },
    { href: '/doctor/settings/mproducts', text: '商品管理' },
    // { href: '/doctor/settings/patients', text: '患者管理' },
    { href: '/doctor/settings/rooms', text: '部屋設定' },
  ]

  const fetchClinicList = useCallback(async () => {
    const res = await clinicList('', 1, 100)
    setClinics(
      res.clinics.filter(
        (cl) => cl.id == user.clinic_id || user.role == 'admin',
      ),
    )
  }, [setClinics, user])

  useEffect(() => {
    fetchClinicList()
  }, [fetchClinicList])

  const changeClinicId = useCallback(
    async (value: string) => {
      setClinicId(Number(value))
      await storeStaff({ id: BigInt(user.id), clinicId: BigInt(value) })
      window.location.reload()
    },
    [user, setClinicId],
  )

  const buttonComponent = (href: string, text: string) => {
    return (
      <li
        className={`max-w-[250px] cursor-pointer px-4 py-2 hover:bg-white ${pathname === href ? 'border-t-4 border-white bg-white' : ''}`}
        key={text}
      >
        <a
          href={href}
          className="w-full rounded border-0 p-0 py-2 hover:text-blue-700 sm:flex md:block"
        >
          <p>{text}</p>
        </a>
      </li>
    )
  }

  return (
    <div className="block w-full border border-gray-300 bg-main-50 text-gray-500">
      <div className="flex w-full items-center justify-center">
        <ul className="border-white-100 justify-items mx-auto flex w-full space-x-0 rounded-lg border-0 font-medium lg:px-16">
          {buttonData.map((data) => buttonComponent(data.href, data.text))}
        </ul>
        <div className="mx-auto"></div>
        <select
          className="w-42 mx-4 rounded py-2 text-center"
          value={clinicId}
          onChange={(e) => {
            changeClinicId(e.target.value)
          }}
        >
          {clinics.map((c, _i) => (
            <option key={_i} value={Number(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
export { SettingMenuBarComponent }
