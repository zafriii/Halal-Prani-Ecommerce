import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Order.css';
import { FaRegCheckCircle } from "react-icons/fa";
import DashHeader from '../My account/DashHeader';
import Dashsidelink from '../My account/Dashsidelink';
import Loading from '../Loading';
import Footer from '../Footer';
import { jsPDF } from "jspdf";


function ViewOrder() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/orders/number/${orderNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrder(data);

           document.title = `Order ${data.orderNumber} - Halal Prani`;
        } else {
          console.error('Error fetching order:', data.message);
        }
      } catch (error) {
        console.error('Error fetching order:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

 
const isBengali = (text) => {
  return /[\u0980-\u09FF]/.test(text);
};

const removeBengaliText = (text) => {
  return text.replace(/[\u0980-\u09FF]+/g, "").trim();
};

const splitTextByLanguage = (text) => {
  const words = text.split(" ");
  const result = [];

  let buffer = "";
  let currentLang = isBengali(words[0]) ? "bn" : "en";

  words.forEach((word) => {
    const lang = isBengali(word) ? "bn" : "en";
    if (lang === currentLang) {
      buffer += (buffer ? " " : "") + word;
    } else {
      result.push({ text: buffer, lang: currentLang });
      buffer = word;
      currentLang = lang;
    }
  });

  if (buffer) result.push({ text: buffer, lang: currentLang });
  return result;
};


const generateOrderSummaryPDF = async (currentOrder) => {
  if (!currentOrder) {
    console.warn("No order data to generate PDF.");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const marginLeft = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const addressBoxWidth = (pageWidth - marginLeft * 3) / 2;
  const lineSpacing = 16;
  const boxHeight = 110;
  const boxPadding = 10;
  const BENGALI_FONT_NAME = 'NotoBengali';

  const orderDate = new Date(currentOrder.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64String = canvas.toDataURL('image/png');
        resolve(base64String);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  try {
    const logoBase64 = await convertImageToBase64('/images/halal-prani-logo.png');
    doc.addImage(logoBase64, 'PNG', marginLeft, 20, 60, 30); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor('#f0b800');
    doc.text(`Halal Prani Order Summary`, marginLeft, 72);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor('#000');
    doc.text(`Order #${currentOrder.orderNumber} was placed on ${orderDate}`, marginLeft, 90);

    doc.setFontSize(14);
    doc.setFont(BENGALI_FONT_NAME, "bold");
    doc.text("Order Details:", marginLeft, 110);

    doc.setFontSize(12);
    doc.setFont(BENGALI_FONT_NAME, "normal");
    doc.text("Product", marginLeft, 130);
    doc.text("Total", pageWidth - marginLeft, 130, { align: "right" });

    let currentY = 150;

    currentOrder.cartItems.forEach(item => {
      const productNameClean = removeBengaliText(item.name);
      const fullText = `${productNameClean} × ${item.quantity}`;
      const productParts = splitTextByLanguage(fullText);

      let xCursor = marginLeft;
      productParts.forEach((part) => {
        const font = part.lang === "bn" ? BENGALI_FONT_NAME : "helvetica";
        doc.setFont(font, "normal");
        const width = doc.getTextWidth(part.text);
        doc.text(part.text, xCursor, currentY);
        xCursor += width + 3;
      });

      const totalPrice = `${(item.price * item.quantity).toFixed(2)} BDT`;
      doc.setFont("helvetica", "normal");
      doc.text(totalPrice, pageWidth - marginLeft, currentY, { align: "right" });

      currentY += 20;
    });

    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
    currentY += 15;

    const breakdownLabels = [
      "Subtotal:",
      "Shipping Fee:",
      "Discount:",
      "Total Amount:",
    ];

    const subtotal = currentOrder.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = currentOrder.shippingFee || 0;
    const discount = currentOrder.discount || 0;
    const totalAmount = currentOrder.totalAmount;

    const breakdownValues = [
      `${subtotal.toFixed(2)} BDT`,
      `${shippingFee.toFixed(2)} BDT`,
      discount === 0 ? "0 BDT" : `- ${discount.toFixed(2)} BDT`,
      `${totalAmount.toFixed(2)} BDT`,
    ];

    breakdownLabels.forEach((label, i) => {
      doc.setFont(BENGALI_FONT_NAME, i === 3 ? "bold" : "normal");
      doc.setTextColor(i === 3 ? "#f0b800" : "#000");
      doc.text(label, marginLeft, currentY);
      doc.text(breakdownValues[i], pageWidth - marginLeft, currentY, { align: "right" });
      currentY += 20;
    });

    currentY += 10;
    doc.setFont(BENGALI_FONT_NAME, "bold");
    doc.setTextColor("#000");
    doc.text("Payment Method", marginLeft, currentY);
    doc.setFont(BENGALI_FONT_NAME, "normal");
    doc.text(currentOrder.paymentMethod, pageWidth - marginLeft, currentY, { align: "right" });

    currentY += 40;

    // Billing Box
    doc.setDrawColor(220);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(marginLeft, currentY, addressBoxWidth, boxHeight, 5, 5, "S");

    doc.setFont(BENGALI_FONT_NAME, "bold");
    doc.setFontSize(12);
    doc.text("Billing Address", marginLeft + boxPadding, currentY + 15);

    doc.setFont(BENGALI_FONT_NAME, "normal");
    doc.setFontSize(11);
    let billingY = currentY + 15 + lineSpacing;

    const billingLines = [
      `Name: ${currentOrder.billing?.name || ""}`,
      `Address: ${currentOrder.billing?.address || ""}`,
      `Postcode: ${currentOrder.billing?.postcode || ""}`,
      `Phone: ${currentOrder.billing?.phone || ""}`,
      `Email: ${currentOrder.billing?.email || ""}`,
    ];

    billingLines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, addressBoxWidth - (boxPadding * 2));
      doc.text(wrapped, marginLeft + boxPadding, billingY);
      billingY += wrapped.length * lineSpacing;
    });

    const shippingX = marginLeft * 2 + addressBoxWidth;
    doc.setDrawColor(220);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(shippingX, currentY, addressBoxWidth, boxHeight, 5, 5, "S");

    doc.setFont(BENGALI_FONT_NAME, "bold");
    doc.setFontSize(12);
    doc.text("Shipping Address", shippingX + boxPadding, currentY + 15);

    doc.setFont(BENGALI_FONT_NAME, "normal");
    doc.setFontSize(11);
    let shippingY = currentY + 15 + lineSpacing;

    const shippingLines = [
      `Name: ${currentOrder.shipping?.name || ""}`,
      `Street: ${currentOrder.shipping?.street || ""}`,
      `District: ${currentOrder.shipping?.district || ""}`,
      `Postcode: ${currentOrder.shipping?.postcode || ""}`,
      `Notes: ${currentOrder.orderNotes || "No special instructions."}`,
    ];

    shippingLines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, addressBoxWidth - (boxPadding * 2));
      doc.text(wrapped, shippingX + boxPadding, shippingY);
      shippingY += wrapped.length * lineSpacing;
    });

    doc.save(`Order_${currentOrder.orderNumber}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};


  const handleDownloadPDF = async () => {
  if (order) {
    await generateOrderSummaryPDF(order);

    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/api/downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderNumber: order.orderNumber }),
      });
    } catch (err) {
      console.error('Error logging download:', err);
    }
  }
};


  if (loading) return <Loading/>;
  if (!order) return <p className='order-not-forund'>Order not found.</p>;

  const orderDateDisplay = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="dashboard-page">
        <DashHeader />
        <div className="dashboard-content-area">
          <Dashsidelink />
          <div className="order-view-container">

            <p className='view-order-place'> Order # {order.orderNumber} was placed on {orderDateDisplay}</p>

            <h2>Order Details:</h2>

            <div className="order-details">
              <div className="order-details-header">
                <span><strong>Product</strong></span>
                <span><strong>Total</strong></span>
              </div>

              <ul className="ordered-items">
                {order.cartItems.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.name} × {item.quantity} </span>
                    <span>{item.price * item.quantity} BDT</span>
                  </li>
                ))}
              </ul>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>
                    {order.cartItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    ).toFixed(2)} BDT
                  </span>
                </div>

                <div className="price-row">
                  <span>Shipping Fee:</span>
                  <span>{order.shippingFee ? order.shippingFee.toFixed(2) : '0.00'} BDT</span>
                </div>

                <div className="price-row">
                  <span>Discount:</span>
                  <span>{order.discount ? `- ${order.discount.toFixed(2)} BDT` : '0 BDT'}</span>
                </div>

                <div className="price-row">
                  <span><strong>Total Amount:</strong></span>
                  <span className='order-total'><strong>{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'} BDT</strong></span>
                </div>

                <div className="price-row">
                  <span><strong>Payment Method</strong></span>
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="address-container">
              <div className="address-box">
                <h3>Billing Address</h3>
                <p><strong>Name:</strong> {order.billing?.name}</p>
                <p><strong>Address:</strong> {order.billing?.address}</p>
                <p><strong>Postcode:</strong> {order.billing?.postcode}</p>
                <p><strong>Phone:</strong> {order.billing?.phone}</p>
                <p><strong>Email:</strong> {order.billing?.email}</p>
              </div>

              <div className="address-box">
                <h3>Shipping Address</h3>
                <p><strong>Name:</strong> {order.shipping?.name}</p>
                <p><strong>Street:</strong> {order.shipping?.street}</p>
                <p><strong>District:</strong> {order.shipping?.district}</p>
                <p><strong>Postcode:</strong> {order.shipping?.postcode}</p>
                <p><strong>Notes:</strong> {order.orderNotes || 'No special instructions.'}</p>
              </div>
            </div>

            <div className="order-actions">
              <button onClick={handleDownloadPDF} className="download-pdf-button">
                Download Order Summary PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ViewOrder;














