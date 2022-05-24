import React, { useEffect } from "react";
import moment from "moment";
import Graph from "./graphs/LineGraph";
import PieGraph from "./graphs/PieGraph.jsx";
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
    return "";
  });
  // console.log(arr);
  arr.sort(function (a, b) {
    return a.Datamov - b.Datamov;
  });

  const results = arr.filter((element) => {
    if (
      Object.keys(element).length !== 0 &&
      !Object.values(element).includes("Invalid date")
    ) {
      return true;
    }

    return false;
  });

  return results;

  // let result = groupByKey(arr, "Datamov");

  // let obj = [result];

  // obj.map((item) => console.log(item["03"]));
}

function getCategoriasfromArray(params) {
  var arr = [{}];
  params.map((item) => {
    var objIndex = arr.findIndex(
      (obj) => obj["Categoria "] === item["Categoria "]
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
        "Categoria ": item["Categoria "],
        valor: Calcdebcred(
          item["Débito "] === "" ? 0 : item["Débito "],
          item["Crédito "] === "" ? 0 : item["Crédito "]
        ),
      });
    }
    return "";
  });
  // console.log(arr);
  //   arr.sort(function (a, b) {
  //     return a.Datamov - b.Datamov;
  //   });

  const results = arr.filter((element) => {
    if (
      Object.keys(element).length !== 0 &&
      !Object.values(element).includes("Invalid date")
    ) {
      return true;
    }

    return false;
  });

  return results;

  // let result = groupByKey(arr, "Datamov");

  // let obj = [result];

  // obj.map((item) => console.log(item["03"]));
}

export default function MediaMensal(props) {
  const [meses, setMeses] = React.useState([]);
  const [categoria, setCategorias] = React.useState([]);

  useEffect(() => {
    setMeses((prevState) => prevState.concat(props.value));
    setCategorias((prevState) => prevState.concat(props.value));
  }, [props.value]);

  let valMediaMensal = doMathonArray(meses);

  let displayTableMediaMensal = valMediaMensal
    .filter(function (dados) {
      if (dados.Datamov === undefined) {
        return false; // skip
      }
      return true;
    })
    .map((dados, i) =>
      dados !== "" ? (
        <tr key={i}>
          <th scope="row">{moment(dados.Datamov, "M").format("MMMM")}</th>
          {<td>{dados.valor}€</td>}
          {/* <td>{Math.round(dados.valor).toFixed(2)}€</td> */}
        </tr>
      ) : (
        ""
      )
    );

  let valCategorias = getCategoriasfromArray(categoria);

  let displayTableCategorias = valCategorias
    .filter(function (dados) {
      if (dados["Categoria "] === " " || dados.valor > 0) {
        return false; // skip
      }
      return true;
    })
    .map((dados, i) =>
      dados !== "" ? (
        <tr key={i}>
          <th scope="row">{dados["Categoria "]}</th>
          {<td>{parseInt(dados.valor)}€</td>}
          {
            <td>
              -
              {parseInt(
                dados.valor.toString().replace("-", "") / valMediaMensal.length
              )}
              €
            </td>
          }
          {/* <td>{Math.round(dados.valor).toFixed(2)}€</td> */}
        </tr>
      ) : (
        ""
      )
    );

  return (
    <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-lg-6">
            <h3 className="text-3xl">Media Mensal</h3>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Mes</th>
                  <th scope="col">Saldo</th>
                </tr>
              </thead>
              <tbody>{displayTableMediaMensal}</tbody>
            </table>
            <h3 className="text-3xl">Custos</h3>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Custos Fixos (Anuais)</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Media/Mes</th>
                </tr>
              </thead>
              <tbody>{displayTableCategorias}</tbody>
            </table>
          </div>
          <div className="col-12 col-lg-6">
            <h3 className="text-3xl">Total Mensal</h3>
            {<Graph value={valMediaMensal}></Graph>}
            <h3 className="text-3xl">Custo Anual por Categoria</h3>
            {<PieGraph value={valCategorias}></PieGraph>}
          </div>
        </div>
      </div>
    </div>
  );
}
