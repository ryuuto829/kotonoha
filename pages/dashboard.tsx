import { useRxCollection } from 'rxdb-hooks'

import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Legend
} from 'recharts'
import { useEffect, useState } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'

import {
  subDays,
  subMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  formatISO,
  differenceInDays,
  getUnixTime,
  fromUnixTime,
  parseISO
} from 'date-fns'

export const DEFAULT_PERIODS = ['last_7d', 'last_30d', 'last_6m', 'all']
export const DEFAULT_METRICS = ['cardsAdded', 'pointsEarned']

export function Menu({
  option,
  changeOption,
  options
}: {
  option: string
  changeOption: (value: string) => void
  options: string[]
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Sorting options"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <span>{option}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px]`}
        >
          <DropdownMenu.RadioGroup value={option} onValueChange={changeOption}>
            {options.map((item) => (
              <DropdownMenu.RadioItem
                key={item}
                value={item}
                className="flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
              >
                <div className="ml-1.5 mr-3 flex-1">{item}</div>
                <CheckIcon
                  className={`w-4 h-4 mr-2.5 ${
                    option === item ? '' : 'hidden'
                  }`}
                />
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

const getStartEndDates = ({
  dailyPeriod,
  monthlyPeriod,
  allPeriod,
  periodNumber
}: {
  dailyPeriod: boolean
  monthlyPeriod: boolean
  allPeriod: boolean
  periodNumber: number
}) => {
  let start, end
  const today = new Date()

  if (dailyPeriod) {
    start = subDays(today, periodNumber)
    end = today
  }

  if (monthlyPeriod) {
    start = subMonths(today, periodNumber)
    end = today
  }

  if (allPeriod) {
    return []
  }

  return [start, end]
}

const getDaysArray = (start: Date, end: Date) => {
  return eachDayOfInterval({ start, end }).map((x) =>
    formatISO(x, { representation: 'date' })
  )
}

const getMonthArray = (start: Date, end: Date) => {
  return eachMonthOfInterval({ start, end }).map((x) =>
    formatISO(x, { representation: 'date' })
  )
}

const getAllArray = (start: string) => {
  const today = new Date()
  const diff = differenceInDays(today, new Date(start))

  if (diff <= 3) {
    return getDaysArray(subDays(today, 3), today)
  }

  const sum = (getUnixTime(today) - getUnixTime(parseISO(start))) / 3

  return Array(4)
    .fill(undefined)
    .map((_, index) => getUnixTime(parseISO(start)) + sum * index)
    .map((x) => formatISO(fromUnixTime(x), { representation: 'date' }))
}

export default function Dashboard() {
  const collection = useRxCollection('progress')

  const [data, setData] = useState()
  const [period, setPeriod] = useState('all')
  const [metric, setMetric] = useState('pointsEarned')

  useEffect(() => {
    if (!collection || !period || !metric) {
      return
    }

    const getChartData = async (metric: string, period: string) => {
      const dailyPeriod = period.endsWith('d')
      const monthlyPeriod = period.endsWith('m')
      const allPeriod = period === 'all'
      /**
       * Get number of days  or months from the period name,
       * ex. 'last_7d' = 7, 'last_6m' = 6
       */
      const periodNumber = Number(period.replace(/\D/g, ''))

      const [start, end] = getStartEndDates({
        dailyPeriod,
        monthlyPeriod,
        allPeriod,
        periodNumber
      })

      const progressDoc = await collection
        ?.find(
          allPeriod && start && end
            ? {
                selector: {
                  name: {
                    $gte: formatISO(start, { representation: 'date' }),
                    $lt: formatISO(end, { representation: 'date' })
                  }
                }
              }
            : undefined
        )
        .sort({ name: 'asc' })
        .exec()

      let chartData
      /**
       * Chart data daily
       */
      if (dailyPeriod) {
        chartData = getDaysArray(start, end).reduce((data, name, index) => {
          const daily = progressDoc.find((x) => x.name === name)?.[metric] || 0
          const previousCumulative = data[index - 1]?.cumulative || 0

          return [
            ...data,
            {
              name: name.split('-').slice(1).join('/'),
              daily,
              cumulative: previousCumulative + daily
            }
          ]
        }, [])
      }

      /**
       * Chart data monthly
       */
      if (monthlyPeriod) {
        chartData = getMonthArray(start, end).reduce((data, name, index) => {
          const daily =
            progressDoc
              .filter((x) => x.name.startsWith(name.slice(0, 7)))
              .reduce((acc, el) => acc + el[metric], 0) || 0

          const previousCumulative = data[index - 1]?.cumulative || 0

          return [
            ...data,
            {
              name: name.split('-').slice(0, 2).join('/'),
              daily,
              cumulative: previousCumulative + daily
            }
          ]
        }, [])
      }

      if (allPeriod) {
        chartData = getAllArray(progressDoc[0]?.name).reduce(
          (data, name, index, arr) => {
            const daily =
              progressDoc
                .filter(
                  (x) => x.name <= name && x.name > (arr[index - 1] || '')
                )
                .reduce((acc, el) => acc + el[metric], 0) || 0

            const previousCumulative = data[index - 1]?.cumulative || 0

            return [
              ...data,
              {
                name: name.split('-').slice(0, 2).join('/'),
                daily,
                cumulative: previousCumulative + daily
              }
            ]
          },
          []
        )
      }

      console.log(chartData)
      setData(chartData)
    }

    getChartData(metric, period)
  }, [collection, period, metric])

  return (
    <>
      {/* <button
        onClick={() => {
          collection?.insert({
            name: '2023-01-02',
            pointsEarned: 4,
            cardsAdded: 4,
            cardsLearned: 4,
            cardsReviewed: 4
          })
        }}
      >
        Add
      </button> */}
      <div className="flex items-center space-x-2">
        <Menu
          option={period}
          changeOption={setPeriod}
          options={DEFAULT_PERIODS}
        />

        <Menu
          option={metric}
          changeOption={setMetric}
          options={DEFAULT_METRICS}
        />
      </div>

      <ComposedChart
        width={672}
        height={250}
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        {/* <YAxis /> */}
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip labelClassName="text-black" />
        <Area
          // label={({ x, y, stroke, value }) => (
          //   <text
          //     x={x}
          //     y={y}
          //     dy={-4}
          //     fill={'white'}
          //     fontSize={10}
          //     textAnchor="middle"
          //   >
          //     {value}
          //   </text>
          // )}
          type="monotone"
          dataKey="cumulative"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="daily"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
        <Legend verticalAlign="bottom" height={36} />
      </ComposedChart>
    </>
  )
}
