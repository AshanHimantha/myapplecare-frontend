import React from 'react';

export function TicketHeader() {
  return (
    <div className="flex flex-wrap gap-5 justify-between px-5 py-3.5 whitespace-nowrap bg-white rounded-md border border-gray-200 border-solid max-md:max-w-full">
      <div className="text-2xl font-semibold text-black">Tickets</div>
      <div className="flex overflow-hidden flex-col justify-center items-start self-start px-1.5 py-2 text-xs bg-white rounded-md border border-solid border-black border-opacity-10 text-neutral-400">
        <div className="flex overflow-hidden gap-2 items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e4e815be2a55ea8a75f070037470bc1cf04b171c5fc54d1729a323fb93321e86?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
            className="object-contain shrink-0 self-stretch my-auto aspect-[0.92] w-[11px]"
            alt=""
          />
          <div className="self-stretch my-auto">Search</div>
        </div>
      </div>
    </div>
  );
}