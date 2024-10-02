'use client';

import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';

const UpcomingCalls = () => {
  const { upcomingCalls } = useGetCalls();

  // Helper function to format date
  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Function to render meeting items
  const renderMeetingItems = () => {
    return upcomingCalls?.map((meeting: Call | CallRecording, index) => {
      const startsAt = (meeting as Call).state?.startsAt;
      const formattedDate = startsAt ? formatDateTime(new Date(startsAt)) : 'No start time available';
      
      return (
        <li key={index}>
          {formattedDate}
        </li>
      );
    });
  };

  return (
    <>
      {upcomingCalls && upcomingCalls?.length > 0 ? (
        <ul>{renderMeetingItems()}</ul>
      ) : (
        <p>No upcoming meetings</p>
      )}
    </>
  );
};

export default UpcomingCalls;
