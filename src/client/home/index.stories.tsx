import type { Meta, StoryObj } from '@storybook/react';

import { Home } from '.';

// storiesのセットアップについて: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    // storiesの配置について: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Home>;

// storiesの引数について: https://storybook.js.org/docs/react/writing-stories/args
// storiesのinteraction testingについて: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const Primary: Story = {};
