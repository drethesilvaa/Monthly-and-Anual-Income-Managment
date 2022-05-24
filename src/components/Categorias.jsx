import React, { useEffect } from "react";
import PieGraph from "./graphs/PieGraph.jsx";

function Calcdebcred(deb, cred) {
  deb = deb.toString().replace(",", ".");
  cred = cred.toString().replace(",", ".");
  return cred - deb;
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

export default function Categorias(props) {
  const [categoria, setCategorias] = React.useState([]);

  useEffect(() => {
    setCategorias((prevState) => prevState.concat(props.value));
  }, [props.value]);

  let val = getCategoriasfromArray(categoria);

  let displayTable = val
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
          {<td>{parseInt(dados.valor.toString().replace("-", ""))}€</td>}
          {/* <td>{Math.round(dados.valor).toFixed(2)}€</td> */}
        </tr>
      ) : (
        ""
      )
    );

  alert(props.nMeses);

  return (
    <div>
      <h3 className="text-3xl">Custos</h3>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Custos Fixos (Anuais)</th>
            <th scope="col">Valor</th>
            <th scope="col">Media/Mes</th>
          </tr>
        </thead>
        <tbody>{displayTable}</tbody>
      </table>
      <div>
        <h3 className="text-3xl">Custo Anual por Categorias</h3>
        {<PieGraph value={val}></PieGraph>}
      </div>
    </div>
  );
}
