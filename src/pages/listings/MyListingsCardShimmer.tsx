import React from "react";

const MyListingsCardShimmer = () => {
  return (
    <div className="mb-4 mr-4 flex h-60 w-64 flex-col gap-5 rounded-2xl border-2 bg-white p-2 sm:flex-row sm:p-4 lg:h-72 lg:h-[290px] lg:w-96 ">
      <div className="flex w-full flex-col px-6">
        <div className="mb-6 mt-auto flex flex-row justify-between gap-3">
          <div className=" mb-6 h-24 w-32 animate-pulse rounded-md bg-gray-200 lg:mb-16 lg:w-64"></div>
          <div className="ml-auto h-8 w-32 animate-pulse rounded-full bg-gray-200"></div>
        </div>
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="mr-auto h-12 w-24 animate-pulse rounded-xl bg-gray-200 lg:w-48 lg:w-96"></div>
        </div>
      </div>
    </div>
  );
};

export default MyListingsCardShimmer;
