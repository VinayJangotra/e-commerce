import React, { ReactElement,useState } from 'react'
import TableHOC from '../components/admin/TableHOC'
import { Link } from 'react-router-dom';
type DataType={
    _id:string;
    amount:number;
    discount:number;
    quantity:number;
    status:ReactElement;
    action:ReactElement;

}
const column:Column<DataType>[]=[
    {
        Header:"Order Id",
        accessor:"_id"
    },
    {
        Header:"Amount",
        accessor:"amount"
    },
    {
        Header:"Discount",
        accessor:"discount"
    },
    {
        Header:"Quantity",
        accessor:"quantity"
    },
    {
        Header:"Status",
        accessor:"status"
    },
    {
        Header:"Action",
        accessor:"action"
    }

]

const Orders = () => {
    const [rows] = useState<DataType[]>([
      {
        _id: "1",
        amount: 1000,
        discount: 100,
        quantity: 2,
        status: <span className="red">Processing</span>,
        action: <Link to={`/order/assassff`}></Link>,
      },
      {
        _id: "2",
        amount: 2000,
        discount: 200,
        quantity: 3,
        status: <span className="red">Processing</span>,
        action: <Link to={`/order/assassff`}></Link>,
      },
      {
        _id: "3",
        amount: 3000,
        discount: 300,
        quantity: 4,
        status: <span className="red">Processing</span>,
        action: <Link to={`/order/assassff`}></Link>,
      },
    ]);
    const Table = TableHOC<DataType>(column,rows,"dashboard-product-box","Orders",true)();
  return (
    <div className='container'>
     <h1>My Orders</h1>
     {Table}
    </div>
  )
}

export default Orders
