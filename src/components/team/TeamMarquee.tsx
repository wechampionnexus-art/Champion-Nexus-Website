'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { User2 } from 'lucide-react';
import { gsap } from 'gsap'; // Imported explicitly to resolve dynamic stream errors
import type { TeamMember } from '@/types/database';

type Props = {
  members: TeamMember[];
  isDemo?: boolean;
};

// Matches the lg: breakpoint used elsewhere in this project (e.g.
// Hero.tsx's desktop/mobile split) — "desktop" here means the same
// 1024px cutoff, not an arbitrary new number.
const DESKTOP_QUERY = '(min-width: 1024px)';

// Requested thresholds: the marquee only kicks in once there are MORE
// team members than a static row/grid can comfortably show at that
// breakpoint — more than 4 on desktop, more than 2 on everything
// smaller (tablet/mobile). At or below the threshold, cards are shown
// as a plain static layout instead: no scrolling, no duplicated cards,
// no GSAP.
const DESKTOP_MARQUEE_THRESHOLD = 4;
const MOBILE_MARQUEE_THRESHOLD = 2;

export function TeamMarquee({ members, isDemo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Guard hydration matching to safely stabilize Next server-side rendering execution
  useEffect(() => {
    setIsMounted(true);

    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reducedMq.matches);
    const reducedHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    reducedMq.addEventListener('change', reducedHandler);

    const desktopMq = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(desktopMq.matches);
    const desktopHandler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    desktopMq.addEventListener('change', desktopHandler);

    return () => {
      reducedMq.removeEventListener('change', reducedHandler);
      desktopMq.removeEventListener('change', desktopHandler);
    };
  }, []);

  // Whether there are enough members at the current breakpoint to
  // justify the marquee at all. Re-evaluated whenever the viewport
  // crosses the desktop breakpoint (e.g. rotating a tablet, resizing a
  // browser window), not just once on mount.
  const marqueeThreshold = isDesktop ? DESKTOP_MARQUEE_THRESHOLD : MOBILE_MARQUEE_THRESHOLD;
  const shouldMarquee = isMounted && !reducedMotion && members.length > marqueeThreshold;

  useEffect(() => {
    if (!shouldMarquee) return;

    const track = trackRef.current;
    if (!track) return;

    // Calculate exact scroll dimension bounds of a single distinct block loop set
    const totalWidth = track.scrollWidth / 2;
    if (totalWidth <= 0) return;

    // Duration is derived from the track's actual pixel length, not a
    // flat "members.length * 4" guess — so scroll SPEED stays visually
    // consistent ("according to own length") regardless of how many
    // cards there are or how wide they render at a given breakpoint,
    // instead of speeding up/slowing down inconsistently as the real
    // content width changes. Clamped to a sane minimum so a set just
    // over the marquee threshold still scrolls at a readable pace.
    const PIXELS_PER_SECOND = 55;
    const duration = Math.max(totalWidth / PIXELS_PER_SECOND, 10);

    // Use a clean GSAP context boundary wrapper
    const context = gsap.context(() => {
      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: -totalWidth,
        duration,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((value) => parseFloat(value) % totalWidth)
        }
      });

      // Pause animations cleanly upon active user hover or touch actions
      track.addEventListener('mouseenter', () => tween.pause());
      track.addEventListener('mouseleave', () => tween.resume());
      track.addEventListener('focusin', () => tween.pause());
      track.addEventListener('focusout', () => tween.resume());
    }, containerRef);

    return () => {
      context.revert();
    };
    // isDesktop is included so crossing the breakpoint rebuilds (or tears
    // down) the animation against the new threshold, not just the old
    // member count.
  }, [shouldMarquee, members.length, isDesktop]);

  if (members.length === 0) return null;

  // Fallback structural skeleton loader block for server rendering passes
  if (!isMounted) {
    return (
      <div className="w-full py-5 overflow-hidden opacity-0">
        <div className="flex gap-5 px-5">
          {members.slice(0, 3).map((m) => (
            <div key={m.id} className="w-64 h-72 bg-gray-100 rounded-xl2 shrink-0 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const renderCard = (member: TeamMember, key: string, hidden: boolean) => (
    <div
      key={key}
      aria-hidden={hidden || undefined}
      className="team-card bg-white border border-line rounded-xl2 shadow-card w-64 shrink-0 overflow-hidden"
    >
      <div className="h-48 bg-surface-gray flex items-center justify-center relative">
        {member.image_url ? (
          <Image
            src={member.image_url}
            alt={member.image_alt || member.name}
            fill
            sizes="256px"
            className="object-cover"
          />
        ) : (
          <User2 size={56} className="text-ink-soft" aria-hidden="true" />
        )}
      </div>
      <div className="p-5 text-left">
        <h3 className="font-display font-bold text-ink">{member.name}</h3>
        <p className="text-ink-muted text-sm mt-0.5">{member.role}</p>
        {isDemo && (
          <p className="text-[10px] uppercase tracking-wide text-ink-soft mt-2">Demo profile</p>
        )}
      </div>
    </div>
  );

  // Not enough members at this breakpoint to justify a marquee: show a
  // plain static layout instead — no scroll track, no duplicated cards,
  // no GSAP involved at all. Stacked as a left-aligned column (not a
  // centered/wrapping row) on every device, per spec — mobile, tablet,
  // and desktop all get the same inline/column arrangement here; it's
  // only once shouldMarquee is true (above) that cards switch to the
  // horizontal scrolling row.
  if (!shouldMarquee) {
    return (
      <div ref={containerRef} className="w-full">
        <div className="flex items-start gap-5 px-5 pb-4">
          {members.map((m) => renderCard(m, m.id, false))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative select-none">
      {/*
        This nested track fixes the mobile invisibility bug!
        By removing native overflow behaviors and enforcing a persistent inline display block container,
        the team cards remain perfectly positioned on all devices without collapsing width dimensions.
      */}
      <div
        ref={trackRef}
        className="flex gap-5 pb-4 w-max will-change-transform"
        tabIndex={-1}
      >
        {members.map((m) => renderCard(m, m.id, false))}
        {/* Duplicate set purely for the seamless GSAP loop; hidden from assistive technologies. */}
        {!reducedMotion && members.map((m) => renderCard(m, `${m.id}-dup`, true))}
      </div>
    </div>
  );
}