import React, { Component } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import moment from "moment";

class Graphs extends Component {
  state = { _data: this.props.value };

  render() {
    const data = [{}];

    let displayLinearGraph = this.state._data
      .filter(function (dados) {
        if (dados.Datamov === undefined) {
          return false; // skip
        }
        return true;
      })
      .map((dados, i) =>
        dados != ""
          ? data.push({
              Datamov: moment(dados.Datamov, "M").format("MMMM"),
              Saldo: dados.valor,
            })
          : ""
      );

    return (
      <LineChart
        width={500}
        height={300}
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
        <Line
          type="monotone"
          dataKey="Saldo"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    );
  }
}

export default Graphs;
