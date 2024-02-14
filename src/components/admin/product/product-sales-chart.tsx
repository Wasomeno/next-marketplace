"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

function generateDummyData() {
  let data: { name: string; uv: number }[] = new Array(31)
  for (let i = 0; i < 31; i++) {
    data[i] = { name: (i + 1).toString(), uv: Math.floor(Math.random() * 500) }
  }
  return data
}

export const ProductSalesChart = ({
  data,
}: {
  data: { name: string; uv: number }[]
}) => {
  return (
    <ResponsiveContainer width={"100%"} height={180}>
      <AreaChart
        width={500}
        height={180}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
