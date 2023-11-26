import Hot, {HotProps} from "@/components/Hot";
import {HiFire, HiShare, HiSparkles} from "react-icons/hi";
import MyCombobox from "@/components/Combobox";

export default function Home() {
  const hotList = [{
    title: "vue",
    link: "vue"
  },{
    title: "react vs vue",
    link: "react-vs-vue"
  }]
  const luckyList = [{
    title: "react",
    link: "react"
  }]
  // 第三方数据资料
  const thirdPartLink: HotProps['list'] = [
    {
      link:'https://2022.stateofjs.com/en-US',
      title:'State of JavaScript 2022'
    },
    {
      link: 'https://risingstars.js.org/2021/en',
      title: '2021 JavaScript Rising Stars',
    },
    {
      link: 'https://2021.stateofcss.com/en-US/',
      title: 'State of CSS 2021',
    },
    {
      link: 'https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/',
      title: 'JS Frameworks Satisfaction 2021',
    }
  ]
  return (
      <div className={'xl:mx-auto flex flex-col items-center gap-y-8'}>
        <div className={'mt-12 w-full'}>
          <div className={'text-xl font-bold mb-6 text-gray-500'}>Npm Package Compare</div>
          <MyCombobox />
        </div>
        <div className={'flex gap-y-4 flex-col gap-x-4 w-full xl:flex-row'}>
          <Hot
              className={'xl:flex-[2]'}
              icon={<HiFire className={'text-[24px] fill-red-500'} />}
              list={hotList}
              title={'Hot'}
          />
          <Hot
              className={'xl:flex-1'}
              icon={<HiSparkles className={'text-[24px] fill-purple-500'} />}
              title={'Lucky Packages'}
              list={luckyList}
          />
          <Hot
              className={'xl:flex-1'}
              icon={<HiShare className={'text-[24px] fill-cyan-500'} />}
              title={'Useful Website'}
              list={thirdPartLink}
          />
        </div>
      </div>
  )
}
