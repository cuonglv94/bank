import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';

const Report = ({ transactions }) => {
  console.log("transactions", transactions);

  const priceFormatter = (column, colIndex) => {
    return (
      <h5><strong>{column.text} </strong></h5>
    );
  }

  const dateFormater = (cell, row) => {
    return (
      moment(cell).format('L | h:mm:ss A')
    );
  }

  const columns = [
    {
      dataField: 'createdAt',
      text: 'Thời gian',
      headerFormatter: priceFormatter,
      formatter: dateFormater
    },
    {
      dataField: 'action',
      text: 'Hành động',
      headerFormatter: priceFormatter
    },
    {
      dataField: 'amount',
      text: 'Số tiền',
      headerFormatter: priceFormatter
    },
    {
      dataField: 'description',
      text: 'Nội dung',
      headerFormatter: priceFormatter
    },
    {
      dataField: 'status',
      text: 'Trạng thái',
      headerFormatter: priceFormatter
    }
  ];

  return (
    <div className="report-table">
      <BootstrapTable
        keyField="id"
        data={transactions}
        columns={columns}
      />
    </div>
  );
};

export default Report;
