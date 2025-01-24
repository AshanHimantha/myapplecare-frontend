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
    <div className="flex border-b p-3 text-sm">
      <div className="w-3/12 font-medium">
        {name}
      </div>
      <div className="w-3/12 text-gray-400 text-center">
        {type}
      </div>
      <div className="w-3/12 text-center text-gray-400">
        {parseFloat(unitPrice).toLocaleString()} LKR
        {isPart && quantity > 1 && ` x ${quantity}`}
      </div>
      <div className="w-2/12 text-center text-gray-400">
        {total.toLocaleString()} LKR
      </div>
      <div className="w-1/12 flex justify-center">
        <button 
          onClick={() => onDelete(item.id)}
          className="text-blue-500 text-center text-xs"
        >
          <img src="/images/bin.svg" alt="delete" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

TicketItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number,
    part: PropTypes.object,
    repair: PropTypes.object
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TicketItem;