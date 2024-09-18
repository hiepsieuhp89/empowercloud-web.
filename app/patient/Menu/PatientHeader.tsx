'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

interface PatientHeaderParams {
  session: Session | null
}

const PatientHeader: React.FC<PatientHeaderParams> = ({ session }) => {
  // const user = sessionStorage.getItem('session_user') ? JSON.parse(sessionStorage.getItem('session_user') ?? "") : JSON.parse(localStorage.getItem('user') ?? "");
  const pathname = usePathname()

  const router = useRouter()
  const currentUser = session?.user as SessionUser

  const role = currentUser.role ?? 'doctor'

  useEffect(() => {
    if (!session) {
      router.push(`/top?role=${role}`)
    }
  }, [session, role, router])

  const signOutHandle = useCallback(async () => {
    await signOut({ redirect: false })
    router.push(`/top?role=${role}`)
  }, [role, router])

  return (
    <nav className="border-gray-200 bg-white">
      <div className="mx-auto flex items-center justify-between px-4 pb-0 pt-2 sm:block md:flex-wrap">
        <a
          href="#"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        ></a>
        <div className="w-full" id="navbar-default">
          <ul className="border-white-100 bg-white-50 rounded-lg border-0 bg-white font-medium sm:block   sm:space-x-2 md:flex md:space-x-2 lg:space-x-4">
            <li className="mx-auto"></li>

            <li
              className={`max-w-[250px] ${pathname.includes('/home') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/home"
                className="rounded border-0 p-0 py-2 text-main-gray hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 md:mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <p>ホーム</p>
              </a>
            </li>

            <li
              className={`max-w-[250px] ${pathname.includes('/patient/reception') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/patient/reception"
                className="rounded border-0 p-0 py-2 text-main-gray hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
              >
                <svg
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 md:mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <p>診療一覧</p>
              </a>
            </li>

            <li
              className={`max-w-[250px] ${pathname.includes('/patient/payment') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/patient/payment"
                className="rounded border-0 p-0 py-2 text-main-gray hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
              >
                <svg
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 md:mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <p>決済</p>
              </a>
            </li>

            <li
              className={`max-w-[250px] ${pathname.includes('/patient/help') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="https://empowerme-cloud.com/helpcenter/"
                target="_"
                className="rounded border-0 p-0 py-2  text-main-gray hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
              >
                <svg
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 md:mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
                <p>ヘルプ</p>
              </a>
            </li>
            <li
              className={`max-w-[250px] ${pathname.includes('/patient/settings') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/patient/settings/info"
                className="rounded border-0 p-0 py-2 text-main-gray hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
              >
                <svg
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 md:mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <p>設定</p>
              </a>
            </li>

            <li className="flex max-w-[250px] items-center text-main-gray md:justify-center lg:px-4">
              <button>
                <svg
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 md:mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>
            </li>
            <li className="flex max-w-[250px] items-center text-main-gray md:justify-center lg:px-4">
              <div className="flex">
                {/* <p>ユーザーアカウント</p> */}
                <div className="group relative">
                  <button className="">
                    <svg
                      width="10"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="sm:size-4 md:size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  <div className="z-9000 absolute right-0 top-4 hidden h-16 w-32 overflow-hidden bg-gray-100 py-4 group-hover:block">
                    <button
                      className="block rounded-xl bg-main-500 md:mx-auto lg:px-4"
                      onClick={signOutHandle}
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default PatientHeader
