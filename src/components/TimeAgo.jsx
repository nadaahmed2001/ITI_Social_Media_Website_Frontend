import React, { useEffect, useState } from 'react';
import { formatTimeAgo } from '../utils/timeAgo';

const TimeAgo = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span title={new Date(timestamp).toLocaleString()}>{timeAgo}</span>;
};

export default TimeAgo;
