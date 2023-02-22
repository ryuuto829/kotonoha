import { useRxCollection } from 'rxdb-hooks'

import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart
} from 'recharts'
import { useEffect, useState } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'

export const DEFAULT_PERIODS = ['last_7d', 'last_30d', 'last_6m', 'all']
export const DEFAULT_METRICS = ['wordsAdded', 'coinsEarned']

export function Menu({
  statusOption,
  changeStatus,
  array
}: {
  statusOption: string
  changeStatus: (value: string) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Sorting options"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <span>{statusOption}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px]`}
        >
          <DropdownMenu.RadioGroup
            value={statusOption}
            onValueChange={changeStatus}
          >
            {array.map((item) => (
              <DropdownMenu.RadioItem
                key={item}
                value={item}
                className="flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
              >
                <div className="ml-1.5 mr-3 flex-1">{item}</div>
                <CheckIcon
                  className={`w-4 h-4 mr-2.5 ${
                    statusOption === item ? '' : 'hidden'
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

export function formatISODate(date: Date) {
  return date.toISOString().split('T')[0]
}

const getStartEndDates = (period) => {
  const today = new Date()
  let start, end

  // 7 days array (daily)
  if (period === 'last_7d' || period === 'last_30d') {
    end = today
    start = new Date(
      Date.now() - 24 * 60 * 60 * 1000 * period.replace(/\D/g, '')
    )
  }

  // last year = last 12 months (monthly)
  if (period === 'last_6m') {
    end = new Date(today.getFullYear(), today.getMonth(), 1)
    start = new Date(
      today.getFullYear(),
      today.getMonth() - period.replace(/\D/g, ''),
      2
    )
  }

  if (period === 'all') {
    return []
  }

  return [formatISODate(start), formatISODate(end)]
}

const getDaysArray = (start, end) => {
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt).toISOString().split('T')[0])
  }
  return arr
}

const getMonthArray = () => {
  const array = []

  for (let i = 1; i < 7; i++) {
    array.push(
      new Date(new Date().getFullYear(), new Date().getMonth() - i, 2)
        .toISOString()
        .split('T')[0]
    )
  }

  return array.reverse()
}

const getAllArray = (start) => {
  const array = []

  const diff = (Date.now() - new Date(start).valueOf()) / 5

  for (let i = 0; i < 6; i++) {
    array.push(
      new Date(new Date(start).valueOf() + diff * i).toISOString().split('T')[0]
    )
  }

  return array
}

export default function Dashboard() {
  const collection = useRxCollection('progress')

  const [data, setData] = useState()
  const [period, setPeriod] = useState('all')
  const [metric, setMetric] = useState('coinsEarned')

  useEffect(() => {
    if (!collection || !period || !metric) {
      return
    }

    const getChartData = async (metric, period) => {
      const [start, end] = getStartEndDates(period)

      const progressDoc = await collection
        ?.find(
          period !== 'all'
            ? {
                selector: {
                  name: {
                    $gte: start,
                    $lt: end
                  }
                }
              }
            : undefined
        )
        .sort({ name: 'asc' })
        .exec()

      console.log(progressDoc)
      /**
       * Aggregate to {name, cumulative, daily}
       */

      let doc2
      /**
       * Chart data daily
       */
      if (period == 'last_7d' || period === 'last_30d') {
        doc2 = getDaysArray(start, end).reduce((data, name, index) => {
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
      if (period === 'last_6m') {
        doc2 = getMonthArray().reduce((data, name, index) => {
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

      if (period === 'all') {
        doc2 = getAllArray(progressDoc[0]?.name).reduce(
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

      console.log(doc2)
      setData(doc2)
    }

    getChartData(metric, period)
  }, [collection, period, metric])

  return (
    <>
      <div>Home page</div>
      <button
        onClick={async () => {
          await collection?.bulkInsert([
            {
              name: '2023-02-21',
              wordsAdded: 2,
              coinsEarned: 1
            },
            {
              name: '2023-02-20',
              wordsAdded: 10,
              coinsEarned: 1
            },
            {
              name: '2023-02-19',
              wordsAdded: 1,
              coinsEarned: 1
            },
            {
              name: '2023-01-25',
              wordsAdded: 5,
              coinsEarned: 1
            },
            {
              name: '2023-02-01',
              wordsAdded: 12,
              coinsEarned: 1
            },
            {
              name: '2023-01-15',
              wordsAdded: 22,
              coinsEarned: 1
            },
            {
              name: '2023-01-20',
              wordsAdded: 2,
              coinsEarned: 1
            },
            {
              name: '2023-01-07',
              wordsAdded: 1,
              coinsEarned: 1
            },
            {
              name: '2022-09-07',
              wordsAdded: 8,
              coinsEarned: 1
            },
            {
              name: '2022-12-14',
              wordsAdded: 18,
              coinsEarned: 1
            },
            {
              name: '2023-02-15',
              wordsAdded: 5,
              coinsEarned: 1
            },
            {
              name: '2022-01-15',
              wordsAdded: 15,
              coinsEarned: 5
            }
          ])
        }}
      >
        Insert data
      </button>

      <div>
        Period:
        <Menu
          statusOption={period}
          changeStatus={setPeriod}
          array={DEFAULT_PERIODS}
        />
      </div>

      <div>
        Metrics:
        <Menu
          statusOption={metric}
          changeStatus={setMetric}
          array={DEFAULT_METRICS}
        />
      </div>

      <ComposedChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
        <Tooltip />
        <Area
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
      </ComposedChart>
    </>
  )
}
