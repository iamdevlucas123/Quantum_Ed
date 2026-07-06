import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <main className="grid min-h-screen place-items-center bg-background px-4 py-8 text-foreground">
            <section className="w-full max-w-md rounded-lg border bg-card p-6 text-center text-card-foreground shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">404</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal">Page not found</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    The page you are looking for does not exist or is no longer available.
                </p>
                <Button asChild className="mt-5">
                    <a href="/">Back to home</a>
                </Button>
            </section>
        </main>
    )
}
