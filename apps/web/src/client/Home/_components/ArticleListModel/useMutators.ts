import type { FetchArticleResult } from '@/client/Home/_components/Article/ArticleList';
import type { InboxItemAdditionalProps } from './InboxItemList';
import type { ReadClipAdditionalProps } from './ReadClipList';
import type { UnreadClipAdditionalProps } from './UnreadClipList';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import type { KeyedMutator } from 'swr';

export interface AdditionalProps {
  readClip: ReadClipAdditionalProps;
  unreadClip: UnreadClipAdditionalProps;
  inboxItem: InboxItemAdditionalProps;
}

export type MutatorKey = keyof AdditionalProps;

type Mutators = {
  [K in MutatorKey]: KeyedMutator<
    FetchArticleResult<AdditionalProps[K]>[]
  > | null;
};

const mutatorsAtom = atom<Mutators>({
  readClip: null,
  unreadClip: null,
  inboxItem: null,
});

export const useMutators = () => {
  const [mutators] = useAtom(mutatorsAtom);
  return mutators;
};

export const useSetMutator = () => {
  const [_mutators, setMutators] = useAtom(mutatorsAtom);
  const setMutator = useCallback(
    <T extends keyof AdditionalProps>(
      key: T,
      mutator: KeyedMutator<FetchArticleResult<AdditionalProps[T]>[]>,
    ) => {
      setMutators((prev) => ({ ...prev, [key]: mutator }));
    },
    [setMutators],
  );
  const removeMutator = useCallback(
    (key: string) => {
      setMutators((prev) => ({ ...prev, [key]: null }));
    },
    [setMutators],
  );

  return { setMutator, removeMutator };
};
