import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card w-64 p-4 bg-transparent rounded-2xl shadow-md space-y-4">
      <Skeleton height={250} width="100%" borderRadius="12px" style={{ backgroundColor: 'transparent' }} />

      <div>
        <Skeleton height={20} width="100%" borderRadius="12px" style={{ backgroundColor: 'transparent' }} />
      </div>

      <div>
        <Skeleton height={20} width="100%" borderRadius="12px" style={{ backgroundColor: 'transparent' }}/>
      </div>

      <div>
        <Skeleton height={20} width="100%" borderRadius="12px" style={{ backgroundColor: 'transparent' }}/>
      </div>
    </div>
  );
};

export default SkeletonCard;
