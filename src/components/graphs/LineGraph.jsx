import React, { Component } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import moment from "moment";

export default function LineGraph(props) {
  const data = [{}];

  let displayLinearGraph = props.value
    .filter(function (dados) {
      if (dados.Datamov === undefined || dados.Datamov === "") {
        return false; // skip
      }
      return true + "$";
    })
    .map((dados, i) =>
      dados !== ""
        ? data.push({
            Datamov: moment(dados.Datamov, "M").format("MMMM"),
            Saldo: dados.valor,
          })
        : ""
    );

  data.shift();
  console.log(data);

  return (
    <ResponsiveContainer width="80%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Datamov" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Saldo" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
