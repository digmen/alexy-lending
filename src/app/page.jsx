import React from 'react'
import Header from './components/Header'
import Image from 'next/image'
import Link from 'next/link'
import Footer from './components/Footer'

export default function page() {
  return (
    <main className="relative w-full overflow-hidden min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[30%] w-[75rem] h-[50rem] bg-[hsla(0,0%,82%,0.16)] blur-[250px] z-[-1] overflow-hidden"></div>
      <Header />
      <article className='px-[80px] flex flex-col items-center'>

        <section className='mt-[100px] max-w-[50rem] flex flex-col items-center '>
          <h1 className='text-[62px] text-[#f5f5f8] flex flex-col font-semibold leading-[120%] text-center my-[24px]'>
            <span>
              Screen Recordings
            </span>
            <span>
              Reimagined with Motion
            </span>
          </h1>
          <p className='text-[18px] text-[#9293aa] leading-[150%] text-center max-w-[37.5rem]'>
            Elevate your videos by creating professional modern animated recordings. Capture every frame with Motion.
          </p>
          <Link
            href='/edit'
            className='bg-[#2f5edf] border-[2px] rounded-full border-[#4d73dc] mt-[2.875rem] px-[1.25rem] py-[.625rem] cursor-pointer hover:bg-[#3b73f3] flex items-center transition-all'
          >
            <Image
              src="/windows.svg"
              width={24}
              height={24}
              alt="Windows logo"
              className='inline-block w-[24px] h-[24px] mr-[.625rem]'
            />
            <span
              className='text-white text-[16px] font-medium leading-[100%]'
            >
              Download Motion for Windows
            </span>
          </Link>
          <p className="text-[0.8125rem] font-normal leading-[150%] text-[rgba(146,147,170,0.65)] text-center mt-2">
            Windows supported versions: 10 and 11
          </p>
        </section>

        <section className='relative mt-[4rem] max-w-[62.5rem] h-[37.5rem] w-full bg-[#121321] rounded-[2.5rem] z-[1000000000]'>
          <div className='w-full h-full bg-[#282828] rounded-[0.9375rem] border-2 border-[#3f3f4a] overflow-hidden'>
            <video autoPlay loop muted playsInline className='w-full h-full object-cover rounded-[0.9375rem] '>
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <div className="relative max-w-[68.75rem] w-full">
          <div className="w-full h-px bg-[linear-gradient(90deg,rgba(2,0,36,0),#646585_50%,transparent)]"></div>
          <div className="absolute top-px left-1/2 -translate-x-1/2 w-[100%] h-[31.25rem] overflow-hidden after:content-[''] after:block after:translate-x-1/2 after:w-1/2 after:h-5 after:bg-[#d9d9d9] after:blur-[125px]"></div>
        </div>
        <div className="relative max-w-[68.75rem] w-full">
          <div className="w-full h-px bg-[linear-gradient(90deg,rgba(2,0,36,0),#646585_50%,transparent)]"></div>
          <div className="absolute top-px left-1/2 -translate-x-1/2 w-[100%] h-[31.25rem] overflow-hidden after:content-[''] after:block after:translate-x-1/2 after:w-1/2 after:h-5 after:bg-[#d9d9d9] after:blur-[125px]"></div>
        </div>

        <section className="mt-[11.25rem] mb-[9.375rem] flex flex-col gap-[6.25rem] max-w-[59.375rem]">
          <div className="flex flex-row gap-[3.75rem]">
            <div className="flex flex-col justify-center">
              <p className="leading-[100%] bg-gradient-to-b from-[#a6beff] to-[#2f5edf] bg-clip-text text-transparent text-[16px] font-semibold -translate-y-[50px]">
                1 • Record
              </p>
              <p className="mt-5 mb-4 text-[#f5f5f8] text-[36px] font-semibold leading-[100%] -translate-y-[50px]">
                Simple to Record
              </p>
              <p className="text-[#c1c2d9] text-[16px] font-normal leading-[150%] -translate-y-[50px]">
                Motion captures your display in high-resolution, and tracks your cursor
                to automatically create a stunning animation.
              </p>
            </div>

            <div className="min-w-[25rem] min-h-[25rem] max-w-[25rem] max-h-[25rem] border border-[#484967] rounded-[16px] bg-[#0d0e24] overflow-hidden w-full">
              <Image
                src="/img1.webp"
                width={400}
                height={400}
                alt="Image 1"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex flex-row gap-[3.75rem]">
            <div className="min-w-[25rem] min-h-[25rem] max-w-[25rem] max-h-[25rem] border border-[#484967] rounded-[16px] bg-[#0d0e24] overflow-hidden w-full">
              <Image
                src="/img2.webp"
                width={400}
                height={400}
                alt="Image 1"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="leading-[100%] bg-gradient-to-b from-[#a6beff] to-[#2f5edf] bg-clip-text text-transparent text-[16px] font-semibold -translate-y-[50px]">
                2 • Edit
              </p>
              <p className="mt-5 mb-4 text-[#f5f5f8] text-[36px] font-semibold leading-[100%] -translate-y-[50px]">
                Personalized Experiences
              </p>
              <p className="text-[#c1c2d9] text-[16px] font-normal leading-[150%] -translate-y-[50px]">
                Create unique experiences & explore Motion’s endless options through our built-in video editor.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-[3.75rem]">
            <div className="flex flex-col justify-center">
              <p className="leading-[100%] bg-gradient-to-b from-[#a6beff] to-[#2f5edf] bg-clip-text text-transparent text-[16px] font-semibold -translate-y-[50px]">
                3 • Export
              </p>
              <p className="mt-5 mb-4 text-[#f5f5f8] text-[36px] font-semibold leading-[100%] -translate-y-[50px]">
                Share Instantly
              </p>
              <p className="text-[#c1c2d9] text-[16px] font-normal leading-[150%] -translate-y-[50px]">
                Motion’s lightning-fast, high-quality system is optimized for you to quickly export & share your creations to the world.
              </p>
            </div>

            <div className="min-w-[25rem] min-h-[25rem] max-w-[25rem] max-h-[25rem] border border-[#484967] rounded-[16px] bg-[#0d0e24] overflow-hidden w-full">
              <Image
                src="/img3.webp"
                width={400}
                height={400}
                alt="Image 1"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        <div className="relative max-w-[68.75rem] w-full">
          <div className="w-full h-px bg-[linear-gradient(90deg,rgba(2,0,36,0),#646585_50%,transparent)]"></div>
          <div className="absolute top-px left-1/2 -translate-x-1/2 w-[100%] h-[31.25rem] overflow-hidden after:content-[''] after:block after:translate-x-1/2 after:w-1/2 after:h-5 after:bg-[#d9d9d9] after:blur-[125px]"></div>
        </div>
        <div className="relative max-w-[68.75rem] w-full">
          <div className="w-full h-px bg-[linear-gradient(90deg,rgba(2,0,36,0),#646585_50%,transparent)]"></div>
          <div className="absolute top-px left-1/2 -translate-x-1/2 w-[100%] h-[31.25rem] overflow-hidden after:content-[''] after:block after:translate-x-1/2 after:w-1/2 after:h-5 after:bg-[#d9d9d9] after:blur-[125px]"></div>
        </div>

        <section className="flex flex-col items-center justify-center mt-[9.375rem] mb-[12.5rem]">
          <p className="text-[3rem] text-[#f5f5f8] font-semibold leading-[120%] text-center mb-[1.5rem]">
            One tool to unleash magic.
          </p>
          <p className="font-normal text-base leading-[150%] text-[#9293aa] text-center max-w-[28.125rem]">
            Use Motion to level up your recordings, enjoy unlimited software
            updates, and full access to all features.
          </p>
          <div className="flex gap-[4rem]">
            <div
              className="relative max-w-[22.625rem] w-full rounded-2xl p-9 border border-[#9d9ebd] mt-[3.125rem] z-10
              before:content-[''] before:block before:absolute before:top-[-15px] before:left-[-15px]
              before:w-[calc(100%+30px)] before:h-[calc(100%+30px)] before:bg-[#2c2e58] before:opacity-55
              before:rounded-2xl before:-z-10 before:blur-[120px]

              after:content-[''] after:block after:absolute after:top-0 after:left-0
              after:w-full after:h-full after:opacity-10
              after:bg-[linear-gradient(139deg,rgba(193,194,217,0.39),rgba(44,44,54,0.22))]
              after:rounded-2xl after:-z-10"
            >
              <h3 className="text-[1.5rem] text-[#c1c2d9] font-medium text-center">
                Free Plan
              </h3>
              <div className="w-fit mx-auto mt-8">
                <div className="flex items-baseline gap-[0.3125rem] mb-[0.3125rem]">
                  <p className="text-[#f5f5f8] text-[2.5rem] font-semibold leading-[100%]">
                    $0
                  </p>
                </div>
                <p className="text-[#c1c2d9] text-[0.8125rem] font-normal leading-[100%]">
                  No payment required
                </p>
              </div>
              <Link
                href="#"
                className="bg-[#f5f5f8] border-2 border-white rounded-full transition-colors duration-150 px-5 py-2.5 text-[#252736] font-medium text-sm w-full my-6 mb-12 text-center inline-block"
              >
                Download Motion free
              </Link>
              <ul className="flex flex-col justify-center gap-4">
                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>Unlimited free updates</p>
                </li>

                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>Export unlimited videos</p>
                </li>

                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>All Motion Software features</p>
                </li>

                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>Includes watermark</p>
                </li>
              </ul>
            </div>

            <div
              className="relative max-w-[22.625rem] w-full rounded-2xl p-9 border border-[#9d9ebd] mt-[3.125rem] z-10
              before:content-[''] before:block before:absolute before:top-[-15px] before:left-[-15px]
              before:w-[calc(100%+30px)] before:h-[calc(100%+30px)] before:bg-[#2c2e58] before:opacity-55
              before:rounded-2xl before:-z-10 before:blur-[120px]

              after:content-[''] after:block after:absolute after:top-0 after:left-0
              after:w-full after:h-full after:opacity-10
              after:bg-[linear-gradient(139deg,rgba(193,194,217,0.39),rgba(44,44,54,0.22))]
              after:rounded-2xl after:-z-10"
            >
              <h3 className="text-[1.5rem] text-[#c1c2d9] font-medium text-center">
                Premium Plan
              </h3>
              <div className="w-fit mx-auto mt-8">
                <div className="flex items-baseline gap-[0.3125rem] mb-[0.3125rem]">
                  <p className="text-[#f5f5f8] text-[2.5rem] font-semibold leading-[100%]">
                    $6
                  </p>
                  <p className="text-[#6b6b84] text-base font-normal -translate-y-[2px] leading-[100%]">
                    /month
                  </p>
                </div>
                <p className="text-[#c1c2d9] text-[0.8125rem] font-normal leading-[100%]">
                  Per month billed monthly
                </p>
              </div>
              <Link
                href="#"
                className="w-full my-6 mb-12 relative flex justify-center items-center rounded-full gap-2 bg-[#2f5edf] border-2 border-[#4d73dc] transition-colors duration-150 px-5 py-2.5 text-white font-medium text-sm hover:bg-[#4d73dc]"
              >
                Get started with Motion
              </Link>

              <ul className="flex flex-col justify-center gap-4">
                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>Unlimited free updates</p>
                </li>

                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>Export unlimited videos</p>
                </li>

                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>Priority support</p>
                </li>

                <li className="flex items-center gap-2 text-[#f5f5f8] text-[14px] font-normal">
                  <Image
                    src="/check.svg"
                    width={18}
                    height={18}
                    alt="Check icon"
                  />
                  <p>All Motion Software features</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>
      <Footer />
    </main>
  )
}
