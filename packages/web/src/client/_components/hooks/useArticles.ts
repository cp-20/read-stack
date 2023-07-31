export type useArticlesOptions = {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
};

export const useArticles = (_options?: useArticlesOptions) => {
  const articles = new Array(20).fill(0).map((_, i) => ({
    id: `id-${i}`,
    title: '【無料】GPUがなくてもStable Diffusionで遊びたい！',
    href: 'https://zenn.dev/cp20/articles/stable-diffusion-webui-with-modal',
    head: '「GPUを持ってないけどAI絵を描いてみたい！」というお悩みを抱えている皆さん、Google Colabで満足していませんか？この記事ではModalを使うことでGoogle Colabより（きっと）優れたAI絵生成体験をGETする方法をご紹介します。',
    ogImage:
      'https://res.cloudinary.com/zenn/image/upload/s--qAxEUfoB--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2580%2590%25E7%2584%25A1%25E6%2596%2599%25E3%2580%2591GPU%25E3%2581%258C%25E3%2581%25AA%25E3%2581%258F%25E3%2581%25A6%25E3%2582%2582Stable%2520Diffusion%25E3%2581%25A7%25E9%2581%258A%25E3%2581%25B3%25E3%2581%259F%25E3%2581%2584%25EF%25BC%2581%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%2597%25E3%2583%25BC%25E3%2581%25B4%25E3%2583%25BC%2Cx_203%2Cy_98/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lkMENtX3dVYnd6b0NyR1g2aEFVaWdkWnZ3dDJPb2g3cVpEWElEUlE9czk2LWM=%2Cr_max%2Cw_90%2Cx_87%2Cy_72/og-base.png',
    progress: Math.floor(Math.random() * 100),
    createdAt: '2021-08-15T00:00:00.000Z',
    referredBy: [],
    tags: ['Python', 'Stable Diffusion'],
    referTo: [],
  }));

  return { articles };
};
