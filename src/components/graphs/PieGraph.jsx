import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a16130",
  "#5ea828",
  "#54965c",
  "#11bf62",
  "#11bcbf",
  "#1f4d5e",
  "#5894d1",
  "#123099",
  "#544885",
  "#4a1ff2",
  "#7820b3",
  "#d169ba",
  "#c94485",
  "#a3142c",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      className="graphLabel"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieGraph(props) {
  const data = [{}];

  props.value
    .filter(function (dados) {
      if (dados["Categoria "] === undefined || dados.valor > 0) {
        return false; // skip
      }
      return true + "$";
    })
    .map((dados, i) =>
      dados["Categoria "] !== " "
        ? data.push({
            name: dados["Categoria "],
            value: parseInt(dados.valor.toString().replace("-", "") + "$"),
          })
        : ""
    );

  data.shift();

  console.log(data);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Legend layout="vertical" verticalAlign="middle" align="right" />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius="0"
          outerRadius="90%"
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
