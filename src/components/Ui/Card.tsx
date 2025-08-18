import { useEffect, useRef, useState } from "react";
import { DeleteIcon } from "./Icons/delete";
import { DocumentIcon } from "./Icons/document";
import { LinkIcon } from "./Icons/link";
import { TwitterIcon } from "./Icons/twitter";
import { YoutubeIcon } from "./Icons/youtube";
import { BackendUrl } from "../../config";


interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube" | "document" | "link";
}


export function Card({ title, link }: CardProps) {
    const [playVideo, setPlayVideo] = useState(false);
    const tweetRef = useRef<HTMLDivElement | null>(null);
    const [tweetEmbedOk, setTweetEmbedOk] = useState(false);
        const normalized = normalizeUrl(link);
        const effectiveType = detectTypeFromLink(normalized) ?? 'link';
    const [lp, setLp] = useState<
        | null
        | {
                url: string;
                domain: string;
                title: string;
                description: string;
                image: string;
                siteName: string;
                favicon: string;
            }
    >(null);
    const [lpLoading, setLpLoading] = useState(false);
    const [lpError, setLpError] = useState<string | null>(null);

    useEffect(() => {
            if (effectiveType !== "twitter") return;
        if (!tweetRef.current) return;
        let cancelled = false;

            const ensureTwitterWidgets = (): Promise<void> => {
                return new Promise((resolve) => {
                    const w = (window as any).twttr;
                    if (w && w.widgets) return resolve();
                    const existing = document.getElementById("twitter-wjs");
                    if (existing) {
                        existing.addEventListener("load", () => resolve(), { once: true });
                        return;
                    }
                    const s = document.createElement("script");
                    s.id = "twitter-wjs";
                    s.src = "https://platform.twitter.com/widgets.js";
                    s.async = true;
                    s.onload = () => resolve();
                    document.body.appendChild(s);
                });
            };

                ensureTwitterWidgets().then(() => {
                    if (cancelled || !tweetRef.current) return;
                    const w = (window as any).twttr;
                    w?.widgets?.load?.(tweetRef.current);
                    // Check after a short delay whether an iframe appeared
                    setTimeout(() => {
                        if (cancelled) return;
                        const ok = !!tweetRef.current?.querySelector('iframe');
                        setTweetEmbedOk(ok);
                    }, 3500);
                });

            return () => {
                cancelled = true;
            };
            }, [effectiveType, normalized]);

    // Fetch link preview for generic links and also for documents as a fallback (many sites block iframes)
    useEffect(() => {
        if (effectiveType !== "link" && effectiveType !== "document") return;
        let cancelled = false;
        setLp(null);
        setLpError(null);
        setLpLoading(true);
        fetch(`${BackendUrl}/preview?url=${encodeURIComponent(normalized)}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`status ${r.status}`);
                return r.json();
            })
            .then((data) => {
                if (cancelled) return;
                setLp(data);
            })
            .catch((e) => {
                if (cancelled) return;
                setLpError(String(e));
            })
            .finally(() => {
                if (cancelled) return;
                setLpLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [effectiveType, normalized]);

    return (
        <div>
            <div className="bg-[#0f172a] rounded-2xl border-gray-600 text-[#f8fafc] p-4 w-72 border-2">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <div className="px-2">
                              {effectiveType === "youtube" ? (
                                <YoutubeIcon />
                              ) : effectiveType === "twitter" ? (
                                <TwitterIcon />
                              ) : effectiveType === "link" ? (
                                <LinkIcon />
                            ) : (
                                <DocumentIcon />
                            )}
                        </div>
                        {title}
                    </div>
                    <div className="flex items-center">
                        <div className="px-2">
                                            <a
                                className="inline-flex"
                                                href={normalized}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={title}
                            >
                                <LinkIcon />
                            </a>
                        </div>
                        <DeleteIcon />
                    </div>
                </div>

                <div className="pt-4">
                              {effectiveType === "youtube" && (
                        playVideo ? (
                            <iframe
                                className="w-full aspect-video rounded-lg"
                                src={
                                  toYouTubeEmbed(normalized) +
                                  (toYouTubeEmbed(normalized).includes("?") ? "&" : "?") +
                                    "autoplay=1"
                                }
                                title="YouTube video player"
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setPlayVideo(true)}
                                className="relative w-full aspect-video group rounded-lg overflow-hidden border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Play video"
                            >
                                            {youTubeThumbnail(link) ? (
                                                                    <img
                                                                        src={youTubeThumbnail(normalized)}
                                                    alt={title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full grid place-items-center text-slate-300">
                                                    Thumbnail unavailable
                                                </div>
                                            )}
                                <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-red-600 shadow">
                                        ▶
                                    </span>
                                </span>
                            </button>
                        )
                    )}

                                            {effectiveType === "twitter" && (
                                                <div
                                                    ref={tweetRef}
                                                    className="w-full rounded-lg overflow-hidden border border-gray-700 min-h-[180px]"
                                                >
                                                    <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark" style={{ margin: 0 }}>
                                                        <a href={normalizeTwitterUrl(normalized)}>Loading tweet…</a>
                                                    </blockquote>
                                                    {!tweetEmbedOk && (
                                                        <div className="p-3 text-xs text-slate-400">
                                                            Embed may be blocked.{' '}
                                                            <a
                                                                href={normalizeTwitterUrl(normalized)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sky-400 hover:underline"
                                                            >
                                                                View on X
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                {effectiveType === "document" && (
                                    <div className="space-y-2">
                                        <iframe
                                            className="w-full h-64 rounded-lg border border-gray-700"
                                            src={toDocEmbed(normalized)}
                                            title={title}
                                            frameBorder={0}
                                            referrerPolicy="no-referrer"
                                        />
                                        {lp && (
                                            <a
                                                href={lp.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
                                                title={lp.title}
                                            >
                                                <img
                                                    src={lp.favicon || faviconFor(lp.url)}
                                                    alt="favicon"
                                                    className="w-5 h-5 rounded"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                                <div className="truncate">
                                                    <div className="text-slate-200 truncate">{lp.title || title}</div>
                                                    <div className="text-slate-400 text-xs truncate">{lp.siteName || lp.domain}</div>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {effectiveType === "link" && (
                                    lp ? (
                                        <a
                                            href={lp.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-lg border border-gray-700 hover:border-gray-500 transition-colors overflow-hidden"
                                            title={lp.title}
                                        >
                                            {lp.image && (
                                                <div className="w-full aspect-video bg-black/20">
                                                    <img
                                                        src={lp.image}
                                                        alt={lp.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).style.display = "none";
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="p-3 flex items-start gap-3">
                                                <img
                                                    src={lp.favicon || faviconFor(lp.url)}
                                                    alt="favicon"
                                                    className="w-5 h-5 rounded mt-0.5"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <div className="text-slate-400 text-xs truncate">{lp.siteName || lp.domain}</div>
                                                    <div className="text-slate-200 font-medium truncate">{lp.title || title}</div>
                                                    {lp.description && (
                                                        <div className="text-slate-400 text-xs mt-1 line-clamp-2">{lp.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </a>
                                    ) : (
                                        <a
                                            href={normalized}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
                                        >
                                            <img
                                                src={faviconFor(normalized)}
                                                alt="favicon"
                                                className="w-5 h-5 rounded"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                            <div className="truncate">
                                                <div className="text-slate-200 truncate">{title}</div>
                                                <div className="text-slate-400 text-xs truncate">{domainOf(normalized)}</div>
                                            </div>
                                            {lpLoading && (
                                                <span className="ml-auto text-xs text-slate-500">Loading…</span>
                                            )}
                                            {lpError && (
                                                <span className="ml-auto text-xs text-red-500">Preview failed</span>
                                            )}
                                        </a>
                                    )
                                )}
                </div>
            </div>
        </div>
    );
}

function toYouTubeEmbed(url: string): string {
    try {
        const u = new URL(url);
                if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace("/", "");
            return `https://www.youtube.com/embed/${id}`;
        }
        if (u.pathname.startsWith("/shorts/")) {
            const id = u.pathname.split("/")[2];
            if (id) return `https://www.youtube.com/embed/${id}`;
        }
        if (u.pathname.startsWith("/embed/")) {
            return url;
        }
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
        // fallback try to replace /watch to /embed
        return url.replace("/watch", "/embed");
    } catch {
        return url;
    }
}

function youTubeThumbnail(url: string): string {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace("/", "");
            return id || null;
        }
        if (u.pathname.startsWith("/shorts/")) {
            const id = u.pathname.split("/")[2];
            return id || null;
        }
        if (u.pathname.startsWith("/embed/")) {
            const id = u.pathname.split("/")[2];
            return id || null;
        }
        const id = u.searchParams.get("v");
        return id || null;
    } catch {
        return null;
    }
}

// getTweetId no longer needed; blockquote + widgets.load handles the full URL

function toDocEmbed(url: string): string {
    try {
        const u = new URL(url);
        const isPDF = u.pathname.toLowerCase().endsWith(".pdf");
        const isGoogleDoc = u.hostname.includes("docs.google.com");
        if (isPDF) {
            return url;
        }
        if (isGoogleDoc) {
            // Transform /edit to /preview for embed
            if (u.pathname.includes("/edit")) {
                return url.replace("/edit", "/preview");
            }
            // Some shared docs use /view — try /preview
            if (!u.pathname.includes("/preview")) {
                return url.endsWith("/") ? `${url}preview` : `${url}/preview`;
            }
            return url;
        }
        // Generic viewer for many doc types (pdf, docx, etc.)
        return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
            url
        )}`;
    } catch {
        return url;
    }
}

function detectTypeFromLink(url: string): CardProps["type"] | null {
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();
        if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
        if (host.includes("twitter.com") || host.includes("x.com")) return "twitter";
        const path = u.pathname.toLowerCase();
        if (path.endsWith(".pdf") || host.includes("docs.google.com")) return "document";
        return null;
    } catch {
        return null;
    }
}

function domainOf(url: string): string {
    try {
        const u = new URL(url);
        return u.hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

function faviconFor(url: string): string {
    try {
        const u = new URL(url);
        // Use Google favicon service for simplicity
        return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
    } catch {
        return "";
    }
}

function normalizeUrl(url: string): string {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
}

function normalizeTwitterUrl(url: string): string {
    try {
        const u = new URL(url);
        if (u.hostname.includes('x.com')) {
            u.hostname = 'twitter.com';
            return u.toString();
        }
        return url;
    } catch {
        return url;
    }
}