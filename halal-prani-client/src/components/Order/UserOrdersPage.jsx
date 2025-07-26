import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserOrders.css';
import DashHeader from '../My account/DashHeader';
import Dashsidelink from '../My account/Dashsidelink';
import Loading from '../Loading';
import Footer from '../Footer';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    document.title = 'Your Orders - Halal Prani'

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Failed to load orders');
        }
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (

    <>
    <div className="dashboard-page">
      <DashHeader />
      <div className="dashboard-content-area">
        <Dashsidelink />

        <div className="user-orders-container">
          <h2>Your Orders</h2>

          {loading ? (
            <Loading />
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : orders.length === 0 ? (
            <p className="no-orders">You have no orders yet.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const itemCount = order.cartItems.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  );
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });

                  return (
                    <tr key={order._id}>
                      <td>
                        <Link className="order-number" to={`/view-order/${order.orderNumber}`}>
                          # {order.orderNumber}
                        </Link>
                      </td>
                      <td>{orderDate}</td>
                      <td>
                        {parseFloat(order.totalAmount).toFixed(2)} ৳ for {itemCount}{" "}
                        {itemCount > 1 ? "items" : "item"}
                      </td>
                      <td>
                        <Link to={`/view-order/${order.orderNumber}`} className="view-button">
                          VIEW
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>

    <Footer/>

    </>
  );
}

export default UserOrdersPage;
