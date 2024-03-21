import React from "react";

const SearchCardShimmer = () => {
  return (
    <div className="mb-4 flex h-[440px] max-w-[890px] select-none flex-col gap-5 rounded-2xl bg-white p-2 shadow-lg sm:flex-row sm:p-4 lg:h-72 ">
      <div className="flex w-full flex-col px-6">
        <div className="mb-6 mt-auto flex flex-row justify-between gap-3">
          <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>
          <div className="ml-auto h-8 w-32 animate-pulse rounded-full bg-gray-200"></div>
        </div>
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="mr-auto h-36 w-64 animate-pulse rounded-xl bg-gray-200 lg:w-96"></div>
          <div className="ml-auto flex w-full flex-1 flex-col gap-5 sm:p-2">
            <div className="flex w-full flex-row items-start justify-start ">
              <div className="ml-auto flex w-full flex-1 flex-col gap-3">
                <div className="h-7 w-32 animate-pulse rounded-2xl bg-gray-200 lg:w-48"></div>
                <div className="h-4 w-24 animate-pulse rounded-2xl bg-gray-200 lg:w-36"></div>
                <div className="h-4 w-24 animate-pulse rounded-2xl bg-gray-200 lg:w-36"></div>
                <div className="h-4 w-24 animate-pulse rounded-2xl bg-gray-200 lg:w-36"></div>
              </div>
              <div className="h-24 w-24 animate-pulse rounded-full  bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCardShimmer;
