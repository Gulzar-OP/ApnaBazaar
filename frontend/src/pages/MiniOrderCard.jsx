import React from 'react';

const MiniOrderCard = ({ order }) => {
  const item = order?.items?.[0];

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        background: '#09090b',
        border: '1px solid #27272a',
        borderRadius: '14px',
        padding: '14px',
        width: '100%',
        maxWidth: '560px',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <img
        src={item?.imageUrl || 'https://via.placeholder.com/120'}
        alt={item?.name || 'Product'}
        style={{
          width: '92px',
          height: '92px',
          objectFit: 'cover',
          borderRadius: '12px',
          flexShrink: 0,
          background: '#1f1f23',
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                margin: '0 0 4px',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fafafa',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item?.name || 'Product Name'}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '0.88rem',
                color: '#a1a1aa',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item?.description || 'No description available'}
            </p>
          </div>

          <span
            style={{
              background:
                order?.status === 'Delivered'
                  ? 'rgba(16,185,129,0.12)'
                  : order?.status === 'Shipped'
                  ? 'rgba(59,130,246,0.12)'
                  : 'rgba(245,158,11,0.12)',
              color:
                order?.status === 'Delivered'
                  ? '#10b981'
                  : order?.status === 'Shipped'
                  ? '#3b82f6'
                  : '#f59e0b',
              padding: '6px 10px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {order?.status || 'Pending'}
          </span>
        </div>

        <div
          style={{
            marginTop: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px 12px',
            fontSize: '0.86rem',
            color: '#d4d4d8',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Order:</strong> {order?._id?.slice(-8) || 'N/A'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Qty:</strong> {item?.qty || 1}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Date:</strong>{' '}
            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Total:</strong> ₹{Number(order?.totalAmount || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniOrderCard;