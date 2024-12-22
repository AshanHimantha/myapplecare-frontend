import React from 'react';

export function TicketRow({ device, imei, customer, priority, contact, category, status }) {
  return (
    <>
      <div className="flex gap-9 items-center mt-2 w-full text-black max-md:mr-2 max-md:max-w-full">
        <div className="grow self-stretch my-auto font-semibold text-center">
          {device} {imei && `(${imei})`}
        </div>
        <div className="self-stretch my-auto text-center text-neutral-400">
          {customer}
        </div>
        <div className="self-stretch my-auto">{priority}</div>
        <div className="self-stretch my-auto text-center text-neutral-400">
          {contact}
        </div>
        <div className="flex gap-3 self-stretch px-1 py-1.5 font-medium whitespace-nowrap bg-white rounded-md border border-solid border-neutral-200">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/82003e0971aef4768eff27478ac1b8f237dd621e9c7a0e3326420061647c654f?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
            className="object-contain shrink-0 aspect-square w-[17px]"
            alt=""
          />
          <div>{category}</div>
        </div>
        <div className={`self-stretch my-auto font-medium ${
          status === 'Ongoing' ? 'text-yellow-300' : 
          status === 'Completed' ? 'text-lime-500' : ''
        }`}>
          {status}
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf521f7ecfd5f4552dae3491ad584dfdaafdc0a2ee7db17bb5a5fb4eb0536421?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[19px]"
          alt=""
        />
      </div>
      <div className="shrink-0 mt-1.5 h-px border border-solid border-zinc-100 max-md:max-w-full" />
    </>
  );
}