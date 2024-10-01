'use client';

import { useGetCalls } from '@/hooks/useGetCalls';
import { useEffect, useState } from 'react';

const UpcomingCalls = () => {
  const [upcomingMeeting, setUpcomingMeeting] = useState<string | null>(null); 
  const { upcomingCalls } = useGetCalls();

  useEffect(() => {
    if (Array.isArray(upcomingCalls) && upcomingCalls.length > 0) {
      const firstCall = upcomingCalls[0];
      const state = firstCall?.state;

      // Subscribe to startsAt$ if it's defined
      const subscription = state?.startsAt$?.subscribe(value => {
        // Ensure value is a valid Date object
        if (value instanceof Date) {
          const time = value.toLocaleString(undefined, {
            weekday: 'short',  
            year: 'numeric',   
            month: 'short',    
            day: '2-digit',    
            hour: '2-digit',   
            minute: '2-digit', 
            hour12: true       
          });
          setUpcomingMeeting(time); // Set formatted string
        } else {
          setUpcomingMeeting(null);
        }
      });

      return () => {
        // Cleanup: unsubscribe if subscription exists
        subscription?.unsubscribe();
      };
    }
  }, [upcomingCalls]); 

  return (
    <div>
      {upcomingMeeting || "No upcoming meeting"}
    </div>
  );
};

export default UpcomingCalls;
