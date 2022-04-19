import React, { useState, Component } from "react";
import moment from "moment";
import Graph from "./graphs";

function groupByKey(array, key) {
  var month = "";
  var valor = 0;
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

function Calcdebcred(deb, cred) {
  deb = deb.toString().replace(",", ".");
  cred = cred.toString().replace(",", ".");
  return cred - deb;
}

function doMathonArray(params) {
  var arr = [{}];
  params.map((item) => {
    var objIndex = arr.findIndex(
      (obj) => obj.Datamov === moment(item["Datamov"], "DD/MM/YYYY").format("M")
    );

    if (objIndex > -1) {
      var prevvalue = arr[objIndex].valor;
      arr[objIndex].valor =
        prevvalue +
        Calcdebcred(
          item["Débito "] === "" ? 0 : item["Débito "],
          item["Crédito "] === "" ? 0 : item["Crédito "]
        );
    } else {
      arr.push({
        Datamov: moment(item["Datamov"], "DD/MM/YYYY").format("M"),
        valor: Calcdebcred(
          item["Débito "] === "" ? 0 : item["Débito "],
          item["Crédito "] === "" ? 0 : item["Crédito "]
        ),
      });
    }
  });
  console.log(arr);
  arr.sort(function (a, b) {
    return a.Datamov - b.Datamov;
  });
  return arr;

  // let result = groupByKey(arr, "Datamov");

  // let obj = [result];

  // obj.map((item) => console.log(item["03"]));
}

class MediaMensal extends Component {
  state = {
    _data: this.props.value,
  };

  render() {
    let val = doMathonArray(this.state._data);

    let displayTable = val
      .filter(function (dados) {
        if (dados.Datamov === undefined) {
          return false; // skip
        }
        return true;
      })
      .map((dados, i) =>
        dados != "" ? (
          <tr key={i}>
            <th scope="row">{dados.Datamov}</th>
            {<td>{dados.valor}€</td>}
            {/* <td>{Math.round(dados.valor).toFixed(2)}€</td> */}
          </tr>
        ) : (
          ""
        )
      );

    return (
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Mes</th>
              <th scope="col">Saldo</th>
            </tr>
          </thead>
          <tbody>{displayTable}</tbody>
        </table>
        <div>{displayTable.length > 0 && <Graph value={val}></Graph>}</div>
      </div>
    );
  }
}

export default MediaMensal;
