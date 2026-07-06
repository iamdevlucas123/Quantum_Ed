export default function Loader() {
    return (
        <div className="grid min-h-screen place-items-center bg-background text-foreground" role="status" aria-live="polite" aria-label="Loading page">
            <div className="flex flex-col items-center gap-4">
                <p className="text-sm font-semibold tracking-normal">QuantumEd</p>
                <span className="size-10 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true" />
            </div>
        </div>
    )
}
