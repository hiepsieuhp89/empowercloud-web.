'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

interface AdminHeaderParams {
  session: Session | null
}

const AdminHeader: React.FC<AdminHeaderParams> = ({ session }) => {
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
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/reception') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/reception"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
                <p>受付一覧</p>
              </a>
            </li>
            <li
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/calendar') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/calendar"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                <p>予約管理</p>
              </a>
            </li>
            <li
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/patient/list') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/patient/list?role=admin"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>

                <p>患者一覧</p>
              </a>
            </li>
            <li
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/history') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/history"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                  />
                </svg>
                <p>診察履歴</p>
              </a>
            </li>
            <li
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/payment') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/payment"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/shift') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/shift"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>

                <p>シフト管理</p>
              </a>
            </li>

            {/* <li
              className={`max-w-[250px] ${pathname.includes('/doctor/sales') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/sales"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>

                <p>売上管理</p>
              </a>
            </li>

            <li
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/chart') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/chart"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 md:mx-auto"
                >
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                </svg>

                <p>経営分析</p>
              </a>
            </li> */}

            <li
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/help') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="https://empowercloud-system.com/helpcenter/"
                target="_"
                className="rounded border-0 p-0 py-2  text-main-gray hover:text-blue-700 sm:flex md:block"
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
              className={`max-w-[250px] cursor-pointer hover:bg-gray-100 ${pathname.includes('/doctor/settings') ? 'border-b-4 border-main-500 lg:px-4' : 'lg:px-4'}`}
            >
              <a
                href="/doctor/settings/info"
                className="rounded border-0 p-0 py-2 text-main-gray hover:text-blue-700 sm:flex md:block"
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

            <li className="flex max-w-[250px] cursor-pointer items-center text-main-gray hover:bg-gray-100 md:justify-center lg:px-4">
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
            <li className="flex max-w-[250px] cursor-pointer items-center text-main-gray hover:bg-gray-100 md:justify-center lg:px-4">
              <div className="flex">
                <p>医師アカウント</p>
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

export default AdminHeader
