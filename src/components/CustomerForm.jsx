import * as React from "react";

 function CustomerForm() {
  return (
    <form className="w-full p-2">
      <div className="flex gap-4 w-full text-xs text-zinc-700 text-opacity-30">
        <div className="flex-1">
          <label htmlFor="firstName" className="sr-only">First Name</label>
          <input
            id="firstName"
            type="text"
            className="w-full px-1.5 py-2 rounded-md border border-solid border-black border-opacity-10"
            placeholder="First Name"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="lastName" className="sr-only">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="w-full px-1.5 py-2 rounded-md border border-solid border-black border-opacity-10"
            placeholder="Last Name"
          />
        </div>
      </div>
      <div className="mt-4 text-xs">
      <label htmlFor="lastName" className="sr-only">Contact No</label>
          <input
            id="lastName"
            type="text"
            className="w-full px-1.5 py-2 rounded-md border border-solid border-black border-opacity-10"
            placeholder="Contact No"
          />
      </div>
    </form>
  );
}

export default CustomerForm;