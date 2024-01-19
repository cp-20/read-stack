import { deliverRss } from '@/features/rss/deliver';

const pollingInterval = 1000 * 60 * 5;

let interval: NodeJS.Timeout | null = null;

export const startRssPolling = () => {
  if (interval !== null) return;
  interval = setInterval(() => void deliverRss(), pollingInterval);
};

export const stopRssPolling = () => {
  if (interval === null) return;
  clearInterval(interval);
  interval = null;
};
