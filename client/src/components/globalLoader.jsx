import '../styles/loader.css';
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useGlobalLoading() {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const isFirstRender = useRef(true)

    useEffect(() => {
        const timeoutMs = isFirstRender.current ? 1800 : 1100
        isFirstRender.current = false
        setIsLoading(true)

        const timer = window.setTimeout(() => {
            setIsLoading(false)
        }, timeoutMs)

        return () => {
            window.clearTimeout(timer)
        }
    }, [location.pathname])

    return isLoading
}

export default function GlobalLoader() {
    return (
        <div className="global-loader" role="status" aria-live="polite" aria-label="Loading page">
            <div className="global-loader__backdrop" />
            <div className="global-loader__panel">
                <div className="global-loader__orbit">
                    <span className="global-loader__ring global-loader__ring--outer" />
                    <span className="global-loader__ring global-loader__ring--middle" />
                    <span className="global-loader__ring global-loader__ring--inner" />
                    <span className="global-loader__core" />
                </div>
            </div>
        </div>
    );
}
