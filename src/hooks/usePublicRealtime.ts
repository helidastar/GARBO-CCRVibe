'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface RealtimeItem {
  id: string;
  type?: string;
  [key: string]: unknown;
}

export const usePublicRealtime = (initialData: RealtimeItem[]) => {
  const [data, setData] = useState<RealtimeItem[]>(initialData);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel('public-feed-updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        const { eventType, new: newItem, old: oldItem, table } = payload;

        setData((currentData) => {
          // Normalize the incoming row so the UI knows how to filter it
          const processedItem = newItem ? { ...newItem } as RealtimeItem : null;
          
          if (processedItem) {
            if (table === 'daily_operations') processedItem.type = 'live_op';
            if (table === 'announcements') processedItem.type = 'announcement';
            if (table === 'incidents') processedItem.type = 'alert';
            if (table === 'master_schedules') processedItem.type = 'schedule';
          }

          switch (eventType) {
            case 'INSERT':
              return [processedItem, ...currentData];
            case 'UPDATE':
              return currentData.map(item => item.id === processedItem.id ? processedItem : item);
            case 'DELETE':
              return currentData.filter(item => item.id !== oldItem.id);
            default:
              return currentData;
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data };
};