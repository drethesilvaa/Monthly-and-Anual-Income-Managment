import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

function dateFormatter(params) {
  try {
    return moment(params.value, "DD/MM/YYYY").format("DD/MM/YYYY");
  } catch (error) {}
}

function dateComparator(date1, date2) {
  const date1Number = monthToComparableNumber(date1);
  const date2Number = monthToComparableNumber(date2);

  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return -1;
  }
  if (date2Number === null) {
    return 1;
  }

  return date1Number - date2Number;
}

// eg 29/08/2004 gets converted to 20040829
function monthToComparableNumber(date) {
  if (date === undefined || date === null || date.length !== 10) {
    return null;
  }

  const yearNumber = Number.parseInt(date.substring(6, 10));
  const monthNumber = Number.parseInt(date.substring(3, 5));
  const dayNumber = Number.parseInt(date.substring(0, 2));

  return yearNumber * 10000 + monthNumber * 100 + dayNumber;
}

class Datatable extends Component {
  state = {
    _data: this.props.value,
    columnDefs: [
      {
        field: "Datamov",
        headerName: "Data",
        valueFormatter: dateFormatter,
        comparator: dateComparator,
      },
      { field: "Descrição ", resizable: true },
      { field: "Débito ", resizable: true },
      { field: "Crédito ", resizable: true },
      { field: "Saldo disponível ", resizable: true },
      { field: "Categoria ", resizable: true },
    ],
  };

  render() {
    return (
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={this.state._data}
          columnDefs={this.state.columnDefs}
        ></AgGridReact>
      </div>
    );
  }
}

export default Datatable;
