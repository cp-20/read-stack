const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT ?? 'https://read-stack.cp20.dev/api';

export default [
  {
    name: 'Read Stack API v1',
    url: `${API_ENDPOINT}/v1/openapi`,
  },
];
