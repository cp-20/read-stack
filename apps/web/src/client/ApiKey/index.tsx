import 'react-toastify/dist/ReactToastify.css';

import { BottomNavigation } from '@/client/LandingPage/_components/BottomNavigation';
import { useAutoRedirectIfNotLoggedIn } from '@/features/supabase/auth';
import { generateRandomString } from '@/shared/lib/generateRandomString';
import { css } from '@emotion/react';
import { Button, Modal } from '@mantine/core';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export const ApiKey: NextPage = () => {
  useAutoRedirectIfNotLoggedIn('/login');

  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const createApiKey = useCallback(async () => {
    const newApiKey = generateRandomString(64);

    const res = await fetch('/api/v1/users/me/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: newApiKey }),
    });

    if (res.ok) {
      setOpen(true);
      setApiKey(newApiKey);
    } else {
      toast.error('APIキーの生成に失敗しました。');
    }
  }, []);

  const deleteApiKey = useCallback(async () => {
    const res = await fetch('/api/v1/users/me/api-keys', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    if (res.ok) {
      toast.success('APIキーを正常に削除しました。');
    } else {
      toast.error('APIキーの削除に失敗しました。');
    }
  }, [apiKey]);

  return (
    <div
      css={css`
      display: flex;
      height: 100vh;
      flex-direction: column;
			`}
    >
      <ToastContainer />
      <div
        css={css`
        display: flex;
        flex: 1;
				align-items: center;
				justify-content: center;
        gap: 1rem;
      `}
      >
        <Button onClick={createApiKey}>APIキー生成</Button>
        <Button color="red" onClick={deleteApiKey}>
          APIキー削除
        </Button>
        <Modal
          onClose={() => {
            setOpen(false);
          }}
          opened={open}
          title="APIキー"
        >
          <p
            css={css`
						padding: 0.5rem;
						background-color: #eee;
					`}
          >
            <code
              css={css`
							font-size: 0.8rem;
							word-break: break-all;
						`}
            >
              {apiKey}
            </code>
          </p>
          <p
            css={css`
						color: #ff6b6b;
					`}
          >
            サーバーには保存されません！必ず保存してください！
          </p>
        </Modal>
      </div>

      <BottomNavigation />
    </div>
  );
};
