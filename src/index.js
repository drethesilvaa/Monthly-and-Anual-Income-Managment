import React, { useState } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import * as XLSX from "xlsx";
import Datatable from "./components/Datatable";
import MediaMensal from "./components/mediamensal";

function App() {
  const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "text" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws, {
          raw: false,
          range: 6,
          header: 6,
          blankrows: false,
          defval: "",
        });

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };

  return [
    <div className="row">
      <div className="col-12 text-center">
        <h1>My spreedsheet</h1>
      </div>
    </div>,
    <div className="row">
      <div className="col-12">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
        ></input>
      </div>
    </div>,
    <div className="row">
      <div className="col-12 col-lg-6">
        {items.length > 0 && <Datatable value={items}></Datatable>}
      </div>
      <div className="col-12 col-lg-6">
        <div className="row">
          <div className="col-12">
            {items.length > 0 && <MediaMensal value={items}></MediaMensal>}
          </div>
          <div className="col-12"></div>
        </div>
      </div>
    </div>,
  ];
}

export default App;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
