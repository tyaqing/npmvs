'use client'
import { Line, LineOptions } from '@antv/g2plot'
import { useEffect, useRef } from 'react'

import { flagColors } from '@/biz/const'
import {DataItemType, thousand} from '@/libs/base'

interface DownloadLineChartProps {
  downloadList: DataItemType[]
}
const DownloadLineChart = ({ downloadList }: DownloadLineChartProps) => {
  const container = useRef(null)
  useEffect(() => {
    if (!container.current) {
      return
    }
    const options: LineOptions = {
      data: downloadList,
      seriesField: 'package',
      xField: 'day',
      yField: 'downloads',
      yAxis: {
        label: {
          // 数值格式化为千分位
          formatter: thousand,
        },
      },
      legend: {
        itemName: {
          style: {
            fontSize: 16, // 字号
            fill: 'black', // 字体颜色
            opacity: 0.8, // 字体透明度
          },
        },
        itemSpacing: 2,
        marker: {
          symbol: 'circle',
        },
        position: 'top',
        flipPage: false,
      },
      xAxis: {
        tickCount: 12,
        grid: {
          line: {
            style: {
              stroke: '#eee',
              lineDash: [4, 2],
            },
          },
          alternateColor: 'rgba(0,0,0,0.01)',
        },
        nice: true,
      },
      smooth: true,
      lineStyle: {
        lineWidth: 3,
      },
      tooltip: {
        domStyles: {
          'g2-tooltip-title': {
            fontSize: '14px',
            fontWeight: 'bold',
          },
          'g2-tooltip-list-item': {
            fontSize: '14px',
          },
          'g2-tooltip': {
            borderRadius: '8px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
        // formatter: thousand,
        formatter(datum) {
          return {
            name: datum.package,
            value: thousand(datum.downloads),
          }
        },
        customItems: (originalItems) => {
          return originalItems.sort((a, b) => {
            return Number(b.value) - Number(a.value)
          })
        },
      },
      color: flagColors,
    }
    const line = new Line(container.current, options)
    line.render()
    return () => {
      line.destroy()
    }
  }, [downloadList])
  return <div ref={container} className={`min-h-[400px]`} />
}

export default DownloadLineChart
