import { beforeEach, describe, expect, it } from 'vitest';

import { useUiStore } from './ui_store';

describe('ui store', () => {
  beforeEach(() => {
    useUiStore.setState({ isLoginModalOpen: false });
  });

  it('starts with the login modal closed', () => {
    expect(useUiStore.getState().isLoginModalOpen).toBe(false);
  });

  it('opens and closes the login modal', () => {
    useUiStore.getState().openLoginModal();
    expect(useUiStore.getState().isLoginModalOpen).toBe(true);

    useUiStore.getState().closeLoginModal();
    expect(useUiStore.getState().isLoginModalOpen).toBe(false);
  });
});
