import React from 'react'


const SelectPoR = () => {
  return (<>
	<div className="text-start w-full font-medium text-lg">
	Add Part or Repair
  </div>
  <div className="w-full mx-auto mt-5 overflow-x-auto">
	<div className=" border border-gray-200 rounded-md flex flex-col justify-center p-5 gap-2">
	  <div className="border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1">
		<img
		  src="./images/part.svg"
		  alt="part"
		  className="w-5 h-5"
		/>
		<span>Part</span>
	  </div>

	  <div className="border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1">
		<img
		  src="./images/repair.svg"
		  alt="part"
		  className="w-5 h-5"
		/>
		<span>Repair</span>
	  </div>

	  <div className="border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1">
		<img
		  src="./images/scharge.svg"
		  alt="part"
		  className="w-5 h-5"
		/>
		<span>Service Charge</span>
	  </div>
	</div>
  </div>
  </>
  )
}

SelectPoR.propTypes = {}

export default SelectPoR