'use client';

import { useGetCalls } from '@/hooks/useGetCalls';
import { useEffect, useState, useCallback } from 'react';

const UpcomingCalls = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Set<string>>(new Set());
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

  // Function to handle subscription
  const handleSubscription = useCallback(() => {
    if (Array.isArray(upcomingCalls) && upcomingCalls.length > 0) {
      const subscriptions = upcomingCalls.map((call) => {
        const state = call?.state;

        return state?.startsAt$?.subscribe((value) => {
          if (value instanceof Date) {
            const formattedDate = formatDateTime(value);
            
            // Add to Set to avoid duplicates
            setUpcomingMeetings((prevMeetings) => {
              if (!prevMeetings.has(formattedDate)) {
                return new Set([...prevMeetings, formattedDate]);
              }
              return prevMeetings;
            });
          }
        });
      });

      return () => {
        subscriptions.forEach(subscription => subscription?.unsubscribe());
      };
    }
  }, [upcomingCalls]);

  useEffect(() => {
    const unsubscribe = handleSubscription();
    return () => unsubscribe && unsubscribe();
  }, [handleSubscription]);

  return (
    <div>
      {upcomingMeetings.size > 0 ? (
        <ul>
          {[...upcomingMeetings].map((meeting, index) => (
            <li key={index}>{meeting}</li>
          ))}
        </ul>
      ) : (
        'No upcoming meetings'
      )}
    </div>
  );
  
};

export default UpcomingCalls;
