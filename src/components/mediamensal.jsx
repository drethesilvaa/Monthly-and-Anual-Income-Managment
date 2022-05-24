import React, { useEffect } from "react";
import moment from "moment";
import Graph from "./graphs/LineGraph";
import Categorias from "./Categorias";

// function groupByKey(array, key) {
//   var month = "";
//   var valor = 0;
//   return array.reduce((hash, obj) => {
//     if (obj[key] === undefined) return hash;
//     return Object.assign(hash, {
//       [obj[key]]: (hash[obj[key]] || []).concat(obj),
//     });
//   }, {});
// }

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

export default function MediaMensal(props) {
  const [meses, setMeses] = React.useState([]);

  useEffect(() => {
    setMeses((prevState) => prevState.concat(props.value));
  }, [props.value]);

  let val = doMathonArray(meses);

  let displayTable = val
    .filter(function (dados) {
      if (dados.Datamov === undefined) {
        return false; // skip
      }
      return true;
    })
    .map((dados, i) =>
      dados !== "" ? (
        <tr key={i}>
          <th scope="row">{dados.Datamov}</th>
          {<td>{dados.valor}€</td>}
          {/* <td>{Math.round(dados.valor).toFixed(2)}€</td> */}
        </tr>
      ) : (
        ""
      )
    );

  const Nmeses = val.length;

  return (
    <div className="row">
      {/* <div className="col-12 col-lg-6">
        {items.length > 0 && <Datatable value={items}></Datatable>}
      </div> */}
      <div className="col-12 col-lg-6">
        <div className="row">
          <div className="col-12">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Mes</th>
                  <th scope="col">Saldo</th>
                </tr>
              </thead>
              <tbody>{displayTable}</tbody>
            </table>
            <div>{<Graph value={val}></Graph>}</div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="row">
          <div className="col-12">
            {props.value.length > 0 && (
              <Categorias value={props.value} nMeses={Nmeses}></Categorias>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
