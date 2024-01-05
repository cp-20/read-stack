export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  return res.json();
};
