'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';
import ExploreMenu from './header/explore_menu';
import LoginModal from './header/login_modal';

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isLoginModalOpen = useUiStore((state) => state.isLoginModalOpen);
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const closeLoginModalState = useUiStore((state) => state.closeLoginModal);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginParam = searchParams?.get('login') ?? null;

  useEffect(() => {
    if (loginParam === '1' && !isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, loginParam, openLoginModal]);

  const closeLoginModal = (): void => {
    if (loginParam === '1') {
      const nextParams = new URLSearchParams(searchParams ?? undefined);
      nextParams.delete('login');
      nextParams.delete('next');
      nextParams.delete('oauth_error');
      const nextQuery = nextParams.toString();
      const nextPathname = pathname ?? '/';
      router.replace(nextQuery ? `${nextPathname}?${nextQuery}` : nextPathname);
    }

    closeLoginModalState();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link className="flex shrink-0 items-center gap-2" href="/" aria-label="QuantumEd home">
            <img className="size-9 rounded-md" src="/assets/icons/quantum-atom-mark.png" alt="QuantumEd" />
            <span className="hidden text-sm font-semibold tracking-normal sm:inline">QuantumEd</span>
          </Link>
          <ExploreMenu />
          <nav className="hidden items-center sm:flex" aria-label="Main navigation">
            <Button asChild variant="ghost" size="sm">
              <Link href="/courses">Courses</Link>
            </Button>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="max-w-36 truncate sm:max-w-56">
                <Link href="/profile">
                  <span className="truncate">{user?.name ?? user?.email}</span>
                </Link>
              </Button>
              <Button id="login" data-testid="logout-button" type="button" variant="outline" size="sm" onClick={() => void logout()}>
                Log Out
              </Button>
            </div>
          ) : (
            <Button id="login" data-testid="auth-open-button" type="button" size="sm" disabled={isLoading} onClick={openLoginModal}>
              Log In
            </Button>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}
