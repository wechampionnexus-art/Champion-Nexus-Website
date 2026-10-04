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

export function TeamMarquee({ members, isDemo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Guard hydration matching to safely stabilize Next server-side rendering execution
  useEffect(() => {
    setIsMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isMounted || reducedMotion || members.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    // Calculate exact scroll dimension bounds of a single distinct block loop set
    const totalWidth = track.scrollWidth / 2;
    if (totalWidth <= 0) return;

    // Use a clean GSAP context boundary wrapper
    const context = gsap.context(() => {
      gsap.set(track, { x: 0 });
      
      const tween = gsap.to(track, {
        x: -totalWidth,
        duration: Math.max(members.length * 4, 20),
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
  }, [isMounted, reducedMotion, members.length]);

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
