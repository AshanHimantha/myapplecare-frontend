import React from 'react';
import PropTypes from 'prop-types';

const TicketItem = ({ item, onDelete }) => {
  const isPart = item?.type === 'part';
  
  // Safe access to nested properties
  const name = isPart 
    ? item?.part?.part_name 
    : item?.repair?.repair_name;
    
  const type = isPart ? 'Part' : 'Repair';
  
  const unitPrice = isPart 
    ? item?.part?.selling_price 
    : item?.repair?.cost;
    
  const quantity = isPart ? item?.quantity : 1;
  const total = parseFloat(unitPrice || 0) * quantity;

  if (!name || !unitPrice) return null;

  return (
    <div className="flex text-xs p-3 items-center">
      <div className="w-5/12">
        {name} {/* Use the extracted name variable instead */}
      </div>
      <div className="w-1/12 text-center">
        {isPart ? (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Part
          </span>
        ) : (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Repair
          </span>
        )}
      </div>
      <div className="w-3/12 text-center">
        {`${parseFloat(unitPrice).toLocaleString()} LKR${isPart ? ` x ${quantity}` : ''}`}
      </div>
      <div className="w-2/12 text-center">
        {`${total.toLocaleString()} LKR`}
      </div>
      <div className="w-1/12 text-center">
        {/* Only show delete button if onDelete is provided */}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

TicketItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number,
    part: PropTypes.shape({
      part_name: PropTypes.string.isRequired,
      selling_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }),
    repair: PropTypes.shape({
      repair_name: PropTypes.string.isRequired,
      cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  }).isRequired,
  onDelete: PropTypes.func
};

// Make onDelete optional
TicketItem.defaultProps = {
  onDelete: null
};

export default TicketItem;