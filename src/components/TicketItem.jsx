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
    : item?.repair?.selling_price;
    
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
            <img
                              src="/images/bin.svg"
                              alt="delete"
                              className="h-5 w-5"
                            />
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