import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

interface GraphicPosition {
  id: string;
  centerX: number;
  top: number;
  bottom: number;
}

interface TeamMemberPosition {
  index: number;
  top: number;
  bottom: number;
  nameSide: 'left' | 'right'; // which side the name/title is on
}

interface TeamPosition {
  sectionTop: number;
  sectionBottom: number;
  headingTop: number;
  headingBottom: number;
  centerX: number;
  leftEdge: number;
  rightEdge: number;
  members: TeamMemberPosition[];
}

interface MailingPosition {
  sectionTop: number;
  sectionBottom: number;
  centerX: number;
  leftEdge: number;
  rightEdge: number;
}

interface NewsPosition {
  sectionTop: number;
  sectionBottom: number;
  centerX: number;
  leftEdge: number;
}

interface TransitionBoxConfig {
  id: string;
  label: string;
  centerX: number;
  centerY: number;
  turnDirection: 'left' | 'right';
  isMobile?: boolean; // For mobile-specific styling
}

interface Positions {
  heroBottom: number;
  heroCenter: number;
  documentHeight: number;
  viewportHeight: number;
  graphics: GraphicPosition[];
  team: TeamPosition | null;
  mailing: MailingPosition | null;
  news: NewsPosition | null;
  isDesktop: boolean;
  transitionBoxes: TransitionBoxConfig[];
  mobileTransitionBoxes: TransitionBoxConfig[];
}

// Component for the ME text box (static, no flip)
function TransitionBox({
  config,
  scrollYProgress: globalScrollYProgress,
  animationRange,
}: {
  config: TransitionBoxConfig;
  scrollYProgress: MotionValue<number>;
  animationRange: [number, number];
}) {
  const { label, centerX, centerY, isMobile } = config;
  const ref = useRef<HTMLDivElement>(null);

  // Box dimensions - height is fixed, width is auto based on content
  const boxHeight = 50;

  // For mobile: use element-specific scroll tracking (more reliable)
  // For desktop: use global scroll progress with animation ranges
  const { scrollYProgress: elementScrollProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] // Track from when element enters to when it leaves
  });

  // Choose which scroll progress to use
  const scrollYProgress = isMobile ? elementScrollProgress : globalScrollYProgress;

  // Overall box opacity
  const boxOpacity = useTransform(
    scrollYProgress,
    isMobile
      ? [0, 0.1]
      : [animationRange[0], animationRange[0] + 0.02],
    [0, 1]
  );

  // Mobile-specific sizing - ME stays prominent, label is smaller to fit
  const meFontSize = isMobile ? '18px' : '16px';
  const labelFontSize = isMobile ? '12px' : '16px';

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'absolute',
        left: centerX,
        top: centerY - boxHeight / 2,
        transform: 'translateX(-50%)', // Center horizontally
        height: boxHeight,
        opacity: boxOpacity,
        zIndex: 10,
        padding: '0 12px', // Padding for the content
        maxWidth: isMobile ? '220px' : 'none', // Constrain width on mobile to fit in box
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '6px' : '8px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: isMobile ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
          textShadow: isMobile
            ? '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4)'
            : '0 0 10px rgba(255, 255, 255, 0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Static ME text */}
        <span style={{ fontSize: meFontSize }}>ME</span>

        {/* Static label part */}
        <span style={{ opacity: 0.6, fontSize: labelFontSize }}>|</span>
        <span style={{ fontSize: labelFontSize }}>{label}</span>
      </div>
    </motion.div>
  );
}

// Child component that handles the scroll-linked animations
// This ensures hooks are always called consistently
function FlowLines({ positions }: { positions: Positions }) {
  const { heroBottom, heroCenter, documentHeight, viewportHeight, graphics, team, mailing, news, isDesktop, transitionBoxes, mobileTransitionBoxes } = positions;
  const [crane, blueprint, framework, skyline, completed] = graphics;
  const scrollableHeight = documentHeight - viewportHeight;

  const { scrollYProgress } = useScroll();

  // Transition box dimensions - width should accommodate longest label
  // "Service provider" is longest at ~15 chars, plus "WE | " prefix (~5 chars) = ~20 chars
  // At ~10px per char in monospace = ~200px, plus padding
  const boxWidth = 240;
  const boxHeight = 50;
  const boxPadding = 20; // Padding around the text for the line path

  // Helper: convert destination element's local scroll to global scroll percentage
  const localToGlobal = useCallback((element: GraphicPosition, localScroll: number) => {
    const elementHeight = element.bottom - element.top;
    const scrollRange = elementHeight + viewportHeight;
    const scrollY = localScroll * scrollRange + (element.top - viewportHeight);
    return Math.max(0, Math.min(1, scrollY / scrollableHeight));
  }, [viewportHeight, scrollableHeight]);

  // Helper: convert team section scroll to global percentage
  const teamToGlobal = useCallback((localScroll: number) => {
    if (!team) return 0;
    const sectionHeight = team.sectionBottom - team.sectionTop;
    const scrollRange = sectionHeight + viewportHeight;
    const scrollY = localScroll * scrollRange + (team.sectionTop - viewportHeight);
    return Math.max(0, Math.min(1, scrollY / scrollableHeight));
  }, [team, viewportHeight, scrollableHeight]);

  // Helper: convert mailing section scroll to global percentage
  const mailingToGlobal = useCallback((localScroll: number) => {
    if (!mailing) return 0;
    const sectionHeight = mailing.sectionBottom - mailing.sectionTop;
    const scrollRange = sectionHeight + viewportHeight;
    const scrollY = localScroll * scrollRange + (mailing.sectionTop - viewportHeight);
    return Math.max(0, Math.min(1, scrollY / scrollableHeight));
  }, [mailing, viewportHeight, scrollableHeight]);

  // Helper: convert news section scroll to global percentage
  const newsToGlobal = useCallback((localScroll: number) => {
    if (!news) return 0;
    const sectionHeight = news.sectionBottom - news.sectionTop;
    const scrollRange = sectionHeight + viewportHeight;
    const scrollY = localScroll * scrollRange + (news.sectionTop - viewportHeight);
    return Math.max(0, Math.min(1, scrollY / scrollableHeight));
  }, [news, viewportHeight, scrollableHeight]);

  // Helper: convert a Y position to scroll percentage (when that Y is in middle of viewport)
  const yToScrollProgress = useCallback((y: number) => {
    // When does this Y position reach the middle of the viewport?
    const scrollY = y - viewportHeight * 0.5;
    return Math.max(0, Math.min(1, scrollY / scrollableHeight));
  }, [viewportHeight, scrollableHeight]);

  // Calculate scroll ranges - line completes just before internal flow starts (local 0.10)
  // All segments use consistent timing: start slightly before element, complete at 0.08
  const ranges = useMemo(() => {
    // Mobile box positions (same calculation as in calculate function)
    const boxOffset = 50;
    const mobileBox1Y = crane.bottom + boxOffset;
    const mobileBox2Y = blueprint.bottom + boxOffset;
    const mobileBox3Y = framework.bottom + boxOffset;
    const mobileBox4Y = skyline.bottom + boxOffset;

    return {
      heroToCrane: [localToGlobal(crane, -0.05), localToGlobal(crane, 0.08)] as [number, number],
      craneToBlueprint: [localToGlobal(blueprint, -0.05), localToGlobal(blueprint, 0.08)] as [number, number],
      blueprintToFramework: [localToGlobal(framework, -0.05), localToGlobal(framework, 0.08)] as [number, number],
      frameworkToSkyline: [localToGlobal(skyline, -0.05), localToGlobal(skyline, 0.08)] as [number, number],
      // Skyline to Completed: route right around Projects to completed
      skylineToCompleted: [localToGlobal(skyline, 0.78), localToGlobal(completed, 0.08)] as [number, number],
      // Completed to News: go left from completed to News section
      completedToNews: [localToGlobal(completed, 0.78), newsToGlobal(0.3)] as [number, number],
      // News to Team transition (replaces old newsToCompleted)
      newsToTeam: [newsToGlobal(0.5), teamToGlobal(0.1)] as [number, number],
      // Completed to Team: start after completed internal flow completes, draw through Team section
      completedToTeam: [localToGlobal(completed, 0.78), teamToGlobal(0.6)] as [number, number],
      // Team to Mailing box: start after team section, both sides animate together
      teamToMailingBox: [teamToGlobal(0.7), mailingToGlobal(0.6)] as [number, number],
      // Mobile box animation ranges
      // Start when box enters viewport
      mobileBox1: [yToScrollProgress(mobileBox1Y) - 0.08, yToScrollProgress(mobileBox1Y) + 0.25] as [number, number],
      mobileBox2: [yToScrollProgress(mobileBox2Y) - 0.08, yToScrollProgress(mobileBox2Y) + 0.25] as [number, number],
      mobileBox3: [yToScrollProgress(mobileBox3Y) - 0.08, yToScrollProgress(mobileBox3Y) + 0.25] as [number, number],
      mobileBox4: [yToScrollProgress(mobileBox4Y) - 0.08, yToScrollProgress(mobileBox4Y) + 0.25] as [number, number],
    };
  }, [localToGlobal, teamToGlobal, mailingToGlobal, yToScrollProgress, crane, blueprint, framework, skyline, completed]);

  // Animated segments - tied to destination graphic's scroll position
  const heroToCrane = useTransform(scrollYProgress, ranges.heroToCrane, [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, ranges.craneToBlueprint, [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, ranges.blueprintToFramework, [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, ranges.frameworkToSkyline, [0, 1]);
  const skylineToCompleted = useTransform(scrollYProgress, ranges.skylineToCompleted, [0, 1]);
  const completedToNews = useTransform(scrollYProgress, ranges.completedToNews, [0, 1]);
  const newsToTeam = useTransform(scrollYProgress, ranges.newsToTeam, [0, 1]);
  const completedToTeam = useTransform(scrollYProgress, ranges.completedToTeam, [0, 1]);
  const teamToMailingBox = useTransform(scrollYProgress, ranges.teamToMailingBox, [0, 1]);

  // Mobile box path animations - start AFTER the graphic above finishes
  // This creates continuous flow: graphic completes → line flows to box → box draws
  const mobileBoxPath1Start = localToGlobal(crane, 0.5); // Start after crane's internal animation
  const mobileBoxPath2Start = localToGlobal(blueprint, 0.5);
  const mobileBoxPath3Start = localToGlobal(framework, 0.5);
  const mobileBoxPath4Start = localToGlobal(skyline, 0.5);

  const mobileBoxPathDuration = 0.08; // How long the box takes to draw

  const mobileBoxPath1 = useTransform(scrollYProgress, [mobileBoxPath1Start, mobileBoxPath1Start + mobileBoxPathDuration], [0, 1]);
  const mobileBoxPath2 = useTransform(scrollYProgress, [mobileBoxPath2Start, mobileBoxPath2Start + mobileBoxPathDuration], [0, 1]);
  const mobileBoxPath3 = useTransform(scrollYProgress, [mobileBoxPath3Start, mobileBoxPath3Start + mobileBoxPathDuration], [0, 1]);
  const mobileBoxPath4 = useTransform(scrollYProgress, [mobileBoxPath4Start, mobileBoxPath4Start + mobileBoxPathDuration], [0, 1]);

  // Calculate turn points for 90° turns
  const heroToCraneTurnY = crane.top - 50;
  const craneToBlueprintTurnY = blueprint.top - 50;
  const blueprintToFrameworkTurnY = framework.top - 50;
  const frameworkToSkylineTurnY = skyline.top - 50;

  // Get transition box configs by ID
  const getBox = (id: string) => transitionBoxes.find(b => b.id === id);
  const craneToBoxConfig = getBox('crane-to-blueprint');
  const blueprintToBoxConfig = getBox('blueprint-to-framework');
  const frameworkToBoxConfig = getBox('framework-to-skyline');
  const skylineToBoxConfig = getBox('skyline-to-completed');

  // Get mobile transition box configs by ID
  const getMobileBox = (id: string) => mobileTransitionBoxes.find(b => b.id === id);
  const mobileBox1 = getMobileBox('mobile-crane-to-blueprint');
  const mobileBox2 = getMobileBox('mobile-blueprint-to-framework');
  const mobileBox3 = getMobileBox('mobile-framework-to-skyline');
  const mobileBox4 = getMobileBox('mobile-skyline-to-completed');

  // Box edge calculations for path splitting
  const halfBoxWidth = boxWidth / 2 + boxPadding;
  const halfBoxHeight = boxHeight / 2 + boxPadding;

  // For skyline to completed: route down the right side, around Projects
  const rightSideMarginX = window.innerWidth - 80; // Right edge of viewport
  const leftSideMarginX = 80; // Left edge of viewport
  const skylineToProjectsTurnY = skyline.bottom + 30; // First turn - go right around Projects
  const skylineToCompletedTurnY = completed.top - 50; // Turn point to go toward completed

  // News section routing (News is now AFTER Completed, goes LEFT)
  const newsTop = news ? news.sectionTop : 0;
  const newsBottom = news ? news.sectionBottom : 0;
  const completedToNewsTurnY = news ? news.sectionTop - 30 : 0; // Turn point from completed to news

  // For completed to team: go down center, around heading, then zigzag through team members
  const teamCenterX = team ? team.centerX : heroCenter; // Center of viewport
  const headingAvoidX = teamCenterX + 220; // Go right to clear ME | Team heading
  const completedToTeamTurnY1 = team ? team.headingTop - 30 : 0; // Above heading - go right
  const completedToTeamTurnY2 = team ? team.headingBottom + 40 : 0; // Below heading
  const teamSectionBottom = team ? team.sectionBottom - 50 : 0; // End point in team section
  const teamLeftX = team ? team.leftEdge : 40; // Left edge for zigzag
  const teamRightX = team ? team.rightEdge : window.innerWidth - 40; // Right edge for zigzag

  // For mailing list box: line splits at top, goes around both sides, meets at bottom center
  const mailingCenterX = mailing ? mailing.centerX : heroCenter;
  const mailingTop = mailing ? mailing.sectionTop + 5 : 0; // Split 5px from top
  const mailingBottom = mailing ? mailing.sectionBottom - (isDesktop ? 80 : 40) : 0; // End higher
  const mailingLeftX = mailing ? mailing.leftEdge : 40;
  const mailingRightX = mailing ? mailing.rightEdge : window.innerWidth - 40;

  return (
    <>
    <svg
      className="pointer-events-none absolute left-0 top-0 gpu-accelerated"
      style={{
        width: '100%',
        height: documentHeight,
        zIndex: 0
      }}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow-flow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {isDesktop ? (
        <>
          <motion.path
            d={`M ${heroCenter} ${heroBottom}
                L ${heroCenter} ${heroToCraneTurnY}
                L ${crane.centerX} ${heroToCraneTurnY}
                L ${crane.centerX} ${crane.top}`}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow-flow)"
            style={{ pathLength: heroToCrane }}
          />
          {/* Crane to Blueprint - with transition box (turns LEFT) */}
          {craneToBoxConfig && (
            <>
              {/* Top path: goes above the box */}
              <motion.path
                d={`M ${crane.centerX} ${crane.bottom}
                    L ${crane.centerX} ${craneToBlueprintTurnY}
                    L ${craneToBoxConfig.centerX + halfBoxWidth} ${craneToBlueprintTurnY}
                    L ${craneToBoxConfig.centerX + halfBoxWidth} ${craneToBoxConfig.centerY - halfBoxHeight}
                    L ${craneToBoxConfig.centerX - halfBoxWidth} ${craneToBoxConfig.centerY - halfBoxHeight}
                    L ${craneToBoxConfig.centerX - halfBoxWidth} ${craneToBlueprintTurnY}
                    L ${blueprint.centerX} ${craneToBlueprintTurnY}
                    L ${blueprint.centerX} ${blueprint.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: craneToBlueprint }}
              />
              {/* Bottom path: goes below the box */}
              <motion.path
                d={`M ${crane.centerX} ${crane.bottom}
                    L ${crane.centerX} ${craneToBlueprintTurnY}
                    L ${craneToBoxConfig.centerX + halfBoxWidth} ${craneToBlueprintTurnY}
                    L ${craneToBoxConfig.centerX + halfBoxWidth} ${craneToBoxConfig.centerY + halfBoxHeight}
                    L ${craneToBoxConfig.centerX - halfBoxWidth} ${craneToBoxConfig.centerY + halfBoxHeight}
                    L ${craneToBoxConfig.centerX - halfBoxWidth} ${craneToBlueprintTurnY}
                    L ${blueprint.centerX} ${craneToBlueprintTurnY}
                    L ${blueprint.centerX} ${blueprint.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: craneToBlueprint }}
              />
            </>
          )}

          {/* Blueprint to Framework - with transition box (turns RIGHT) */}
          {blueprintToBoxConfig && (
            <>
              {/* Top path: goes above the box */}
              <motion.path
                d={`M ${blueprint.centerX} ${blueprint.bottom}
                    L ${blueprint.centerX} ${blueprintToFrameworkTurnY}
                    L ${blueprintToBoxConfig.centerX - halfBoxWidth} ${blueprintToFrameworkTurnY}
                    L ${blueprintToBoxConfig.centerX - halfBoxWidth} ${blueprintToBoxConfig.centerY - halfBoxHeight}
                    L ${blueprintToBoxConfig.centerX + halfBoxWidth} ${blueprintToBoxConfig.centerY - halfBoxHeight}
                    L ${blueprintToBoxConfig.centerX + halfBoxWidth} ${blueprintToFrameworkTurnY}
                    L ${framework.centerX} ${blueprintToFrameworkTurnY}
                    L ${framework.centerX} ${framework.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: blueprintToFramework }}
              />
              {/* Bottom path: goes below the box */}
              <motion.path
                d={`M ${blueprint.centerX} ${blueprint.bottom}
                    L ${blueprint.centerX} ${blueprintToFrameworkTurnY}
                    L ${blueprintToBoxConfig.centerX - halfBoxWidth} ${blueprintToFrameworkTurnY}
                    L ${blueprintToBoxConfig.centerX - halfBoxWidth} ${blueprintToBoxConfig.centerY + halfBoxHeight}
                    L ${blueprintToBoxConfig.centerX + halfBoxWidth} ${blueprintToBoxConfig.centerY + halfBoxHeight}
                    L ${blueprintToBoxConfig.centerX + halfBoxWidth} ${blueprintToFrameworkTurnY}
                    L ${framework.centerX} ${blueprintToFrameworkTurnY}
                    L ${framework.centerX} ${framework.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: blueprintToFramework }}
              />
            </>
          )}

          {/* Framework to Skyline - with transition box (turns LEFT) */}
          {frameworkToBoxConfig && (
            <>
              {/* Top path: goes above the box */}
              <motion.path
                d={`M ${framework.centerX} ${framework.bottom}
                    L ${framework.centerX} ${frameworkToSkylineTurnY}
                    L ${frameworkToBoxConfig.centerX + halfBoxWidth} ${frameworkToSkylineTurnY}
                    L ${frameworkToBoxConfig.centerX + halfBoxWidth} ${frameworkToBoxConfig.centerY - halfBoxHeight}
                    L ${frameworkToBoxConfig.centerX - halfBoxWidth} ${frameworkToBoxConfig.centerY - halfBoxHeight}
                    L ${frameworkToBoxConfig.centerX - halfBoxWidth} ${frameworkToSkylineTurnY}
                    L ${skyline.centerX} ${frameworkToSkylineTurnY}
                    L ${skyline.centerX} ${skyline.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: frameworkToSkyline }}
              />
              {/* Bottom path: goes below the box */}
              <motion.path
                d={`M ${framework.centerX} ${framework.bottom}
                    L ${framework.centerX} ${frameworkToSkylineTurnY}
                    L ${frameworkToBoxConfig.centerX + halfBoxWidth} ${frameworkToSkylineTurnY}
                    L ${frameworkToBoxConfig.centerX + halfBoxWidth} ${frameworkToBoxConfig.centerY + halfBoxHeight}
                    L ${frameworkToBoxConfig.centerX - halfBoxWidth} ${frameworkToBoxConfig.centerY + halfBoxHeight}
                    L ${frameworkToBoxConfig.centerX - halfBoxWidth} ${frameworkToSkylineTurnY}
                    L ${skyline.centerX} ${frameworkToSkylineTurnY}
                    L ${skyline.centerX} ${skyline.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: frameworkToSkyline }}
              />
            </>
          )}
          {/* Skyline to Completed - goes RIGHT around Projects */}
          {skylineToBoxConfig && (
            <>
              {/* Top path around box */}
              <motion.path
                d={`M ${skyline.centerX} ${skyline.bottom}
                    L ${skyline.centerX} ${skylineToProjectsTurnY}
                    L ${rightSideMarginX} ${skylineToProjectsTurnY}
                    L ${rightSideMarginX} ${skylineToCompletedTurnY}
                    L ${skylineToBoxConfig.centerX + halfBoxWidth} ${skylineToCompletedTurnY}
                    L ${skylineToBoxConfig.centerX + halfBoxWidth} ${skylineToBoxConfig.centerY - halfBoxHeight}
                    L ${skylineToBoxConfig.centerX - halfBoxWidth} ${skylineToBoxConfig.centerY - halfBoxHeight}
                    L ${skylineToBoxConfig.centerX - halfBoxWidth} ${skylineToCompletedTurnY}
                    L ${completed.centerX} ${skylineToCompletedTurnY}
                    L ${completed.centerX} ${completed.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: skylineToCompleted }}
              />
              {/* Bottom path around box */}
              <motion.path
                d={`M ${skyline.centerX} ${skyline.bottom}
                    L ${skyline.centerX} ${skylineToProjectsTurnY}
                    L ${rightSideMarginX} ${skylineToProjectsTurnY}
                    L ${rightSideMarginX} ${skylineToCompletedTurnY}
                    L ${skylineToBoxConfig.centerX + halfBoxWidth} ${skylineToCompletedTurnY}
                    L ${skylineToBoxConfig.centerX + halfBoxWidth} ${skylineToBoxConfig.centerY + halfBoxHeight}
                    L ${skylineToBoxConfig.centerX - halfBoxWidth} ${skylineToBoxConfig.centerY + halfBoxHeight}
                    L ${skylineToBoxConfig.centerX - halfBoxWidth} ${skylineToCompletedTurnY}
                    L ${completed.centerX} ${skylineToCompletedTurnY}
                    L ${completed.centerX} ${completed.top}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: skylineToCompleted }}
              />
            </>
          )}
          {/* Completed to News - goes LEFT to News section */}
          {news && (
            <motion.path
              d={`M ${completed.centerX} ${completed.bottom}
                  L ${completed.centerX} ${completedToNewsTurnY}
                  L ${leftSideMarginX} ${completedToNewsTurnY}
                  L ${leftSideMarginX} ${newsTop}
                  L ${leftSideMarginX} ${newsBottom}`}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-flow)"
              style={{ pathLength: completedToNews }}
            />
          )}
          {/* News to Team - from News section, around heading, zigzag through team members */}
          {team && team.members.length > 0 && (() => {
            const members = team.members;
            const firstMember = members[0];

            // Start X based on first member's name side
            const startX = firstMember.nameSide === 'left' ? teamLeftX : teamRightX;

            // Build the zigzag path
            let pathSegments: string[] = [];

            // Start from News section (left side) if news exists, otherwise from completed
            const startY = news ? newsBottom : completed.bottom;
            const startXPos = news ? leftSideMarginX : completed.centerX;

            // From news/completed, around heading, to first member's side
            pathSegments.push(
              `M ${startXPos} ${startY}`,
              `L ${startXPos} ${completedToTeamTurnY1}`,
              `L ${headingAvoidX} ${completedToTeamTurnY1}`,
              `L ${headingAvoidX} ${completedToTeamTurnY2}`,
              `L ${startX} ${completedToTeamTurnY2}`
            );

            // Zigzag through each team member
            members.forEach((member, i) => {
              const currentX = member.nameSide === 'left' ? teamLeftX : teamRightX;

              // Go down alongside this member (from top to bottom)
              pathSegments.push(`L ${currentX} ${member.top - 20}`);
              pathSegments.push(`L ${currentX} ${member.bottom + 20}`);

              // If there's a next member, cross horizontally to their side
              if (i < members.length - 1) {
                const nextMember = members[i + 1];
                const nextX = nextMember.nameSide === 'left' ? teamLeftX : teamRightX;
                // Cross in the gap between members
                const crossY = (member.bottom + nextMember.top) / 2;
                pathSegments.push(`L ${currentX} ${crossY}`);
                pathSegments.push(`L ${nextX} ${crossY}`);
              }
            });

            // End at mailing section (center bottom of team)
            const lastMember = members[members.length - 1];
            const lastX = lastMember.nameSide === 'left' ? teamLeftX : teamRightX;
            pathSegments.push(`L ${lastX} ${teamSectionBottom}`);
            pathSegments.push(`L ${teamCenterX} ${teamSectionBottom}`);

            return (
              <motion.path
                d={pathSegments.join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: news ? newsToTeam : completedToTeam }}
              />
            );
          })()}
          {/* Mailing List Box - line splits and goes around both sides */}
          {mailing && (
            <>
              {/* Left side of box: center → left → down → center */}
              <motion.path
                d={`M ${mailingCenterX} ${teamSectionBottom}
                    L ${mailingCenterX} ${mailingTop}
                    L ${mailingLeftX} ${mailingTop}
                    L ${mailingLeftX} ${mailingBottom}
                    L ${mailingCenterX} ${mailingBottom}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: teamToMailingBox }}
              />
              {/* Right side of box: center → right → down → center */}
              <motion.path
                d={`M ${mailingCenterX} ${teamSectionBottom}
                    L ${mailingCenterX} ${mailingTop}
                    L ${mailingRightX} ${mailingTop}
                    L ${mailingRightX} ${mailingBottom}
                    L ${mailingCenterX} ${mailingBottom}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: teamToMailingBox }}
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* Mobile: Hero to Crane - simple straight line */}
          <motion.line
            x1={heroCenter} y1={heroBottom}
            x2={crane.centerX} y2={crane.top}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-flow)"
            style={{ pathLength: heroToCrane }}
          />

          {/* Mobile box outlines - connects from graphic, splits around text, continues */}
          {mobileBox1 && (() => {
            const boxHalfWidth = 120;
            const boxHalfHeight = 25;
            const tailLength = 20;
            return (
              <>
                {/* Connection from graphic + left side of box + continuation */}
                <motion.path
                  d={`M ${crane.centerX} ${crane.bottom}
                      L ${mobileBox1.centerX} ${mobileBox1.centerY - boxHalfHeight}
                      L ${mobileBox1.centerX - boxHalfWidth} ${mobileBox1.centerY - boxHalfHeight}
                      L ${mobileBox1.centerX - boxHalfWidth} ${mobileBox1.centerY + boxHalfHeight}
                      L ${mobileBox1.centerX} ${mobileBox1.centerY + boxHalfHeight}
                      L ${mobileBox1.centerX} ${mobileBox1.centerY + boxHalfHeight + tailLength}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath1 }}
                />
                {/* Right side of box */}
                <motion.path
                  d={`M ${mobileBox1.centerX} ${mobileBox1.centerY - boxHalfHeight}
                      L ${mobileBox1.centerX + boxHalfWidth} ${mobileBox1.centerY - boxHalfHeight}
                      L ${mobileBox1.centerX + boxHalfWidth} ${mobileBox1.centerY + boxHalfHeight}
                      L ${mobileBox1.centerX} ${mobileBox1.centerY + boxHalfHeight}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath1 }}
                />
              </>
            );
          })()}
          {mobileBox2 && (() => {
            const boxHalfWidth = 120;
            const boxHalfHeight = 25;
            const tailLength = 20;
            return (
              <>
                <motion.path
                  d={`M ${blueprint.centerX} ${blueprint.bottom}
                      L ${mobileBox2.centerX} ${mobileBox2.centerY - boxHalfHeight}
                      L ${mobileBox2.centerX - boxHalfWidth} ${mobileBox2.centerY - boxHalfHeight}
                      L ${mobileBox2.centerX - boxHalfWidth} ${mobileBox2.centerY + boxHalfHeight}
                      L ${mobileBox2.centerX} ${mobileBox2.centerY + boxHalfHeight}
                      L ${mobileBox2.centerX} ${mobileBox2.centerY + boxHalfHeight + tailLength}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath2 }}
                />
                <motion.path
                  d={`M ${mobileBox2.centerX} ${mobileBox2.centerY - boxHalfHeight}
                      L ${mobileBox2.centerX + boxHalfWidth} ${mobileBox2.centerY - boxHalfHeight}
                      L ${mobileBox2.centerX + boxHalfWidth} ${mobileBox2.centerY + boxHalfHeight}
                      L ${mobileBox2.centerX} ${mobileBox2.centerY + boxHalfHeight}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath2 }}
                />
              </>
            );
          })()}
          {mobileBox3 && (() => {
            const boxHalfWidth = 120;
            const boxHalfHeight = 25;
            const tailLength = 20;
            return (
              <>
                <motion.path
                  d={`M ${framework.centerX} ${framework.bottom}
                      L ${mobileBox3.centerX} ${mobileBox3.centerY - boxHalfHeight}
                      L ${mobileBox3.centerX - boxHalfWidth} ${mobileBox3.centerY - boxHalfHeight}
                      L ${mobileBox3.centerX - boxHalfWidth} ${mobileBox3.centerY + boxHalfHeight}
                      L ${mobileBox3.centerX} ${mobileBox3.centerY + boxHalfHeight}
                      L ${mobileBox3.centerX} ${mobileBox3.centerY + boxHalfHeight + tailLength}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath3 }}
                />
                <motion.path
                  d={`M ${mobileBox3.centerX} ${mobileBox3.centerY - boxHalfHeight}
                      L ${mobileBox3.centerX + boxHalfWidth} ${mobileBox3.centerY - boxHalfHeight}
                      L ${mobileBox3.centerX + boxHalfWidth} ${mobileBox3.centerY + boxHalfHeight}
                      L ${mobileBox3.centerX} ${mobileBox3.centerY + boxHalfHeight}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath3 }}
                />
              </>
            );
          })()}
          {mobileBox4 && (() => {
            const boxHalfWidth = 120;
            const boxHalfHeight = 25;
            const tailLength = 20;
            return (
              <>
                <motion.path
                  d={`M ${skyline.centerX} ${skyline.bottom}
                      L ${mobileBox4.centerX} ${mobileBox4.centerY - boxHalfHeight}
                      L ${mobileBox4.centerX - boxHalfWidth} ${mobileBox4.centerY - boxHalfHeight}
                      L ${mobileBox4.centerX - boxHalfWidth} ${mobileBox4.centerY + boxHalfHeight}
                      L ${mobileBox4.centerX} ${mobileBox4.centerY + boxHalfHeight}
                      L ${mobileBox4.centerX} ${mobileBox4.centerY + boxHalfHeight + tailLength}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath4 }}
                />
                <motion.path
                  d={`M ${mobileBox4.centerX} ${mobileBox4.centerY - boxHalfHeight}
                      L ${mobileBox4.centerX + boxHalfWidth} ${mobileBox4.centerY - boxHalfHeight}
                      L ${mobileBox4.centerX + boxHalfWidth} ${mobileBox4.centerY + boxHalfHeight}
                      L ${mobileBox4.centerX} ${mobileBox4.centerY + boxHalfHeight}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-flow)"
                  style={{ pathLength: mobileBoxPath4 }}
                />
              </>
            );
          })()}
          {/* Mobile: No lines through News or Team sections - flow stops at building, mailing box draws independently */}
          {/* Mailing List Box - draws box around contact section (mobile) */}
          {mailing && (
            <>
              {/* Left side of box */}
              <motion.path
                d={`M ${mailingCenterX} ${mailingTop}
                    L ${mailingLeftX} ${mailingTop}
                    L ${mailingLeftX} ${mailingBottom}
                    L ${mailingCenterX} ${mailingBottom}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: teamToMailingBox }}
              />
              {/* Right side of box */}
              <motion.path
                d={`M ${mailingCenterX} ${mailingTop}
                    L ${mailingRightX} ${mailingTop}
                    L ${mailingRightX} ${mailingBottom}
                    L ${mailingCenterX} ${mailingBottom}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: teamToMailingBox }}
              />
            </>
          )}
        </>
      )}
    </svg>

    {/* Transition Boxes with ME branding */}
    {isDesktop && (
      <>
        {craneToBoxConfig && (
          <TransitionBox
            config={craneToBoxConfig}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.craneToBlueprint}
          />
        )}
        {blueprintToBoxConfig && (
          <TransitionBox
            config={blueprintToBoxConfig}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.blueprintToFramework}
          />
        )}
        {frameworkToBoxConfig && (
          <TransitionBox
            config={frameworkToBoxConfig}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.frameworkToSkyline}
          />
        )}
        {skylineToBoxConfig && (
          <TransitionBox
            config={skylineToBoxConfig}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.skylineToCompleted}
          />
        )}
      </>
    )}

    {/* Mobile Transition Boxes with ME branding */}
    {/* Uses mobile-specific ranges based on when BOX is visible, not next section */}
    {!isDesktop && (
      <>
        {mobileBox1 && (
          <TransitionBox
            config={mobileBox1}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.mobileBox1}
          />
        )}
        {mobileBox2 && (
          <TransitionBox
            config={mobileBox2}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.mobileBox2}
          />
        )}
        {mobileBox3 && (
          <TransitionBox
            config={mobileBox3}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.mobileBox3}
          />
        )}
        {mobileBox4 && (
          <TransitionBox
            config={mobileBox4}
            scrollYProgress={scrollYProgress}
            animationRange={ranges.mobileBox4}
          />
        )}
      </>
    )}
    </>
  );
}

// Main component that calculates positions
export function PageFlowLine() {
  const [positions, setPositions] = useState<Positions | null>(null);

  // Calculate positions of all graphics
  const calculate = useCallback(() => {
    const heroEl = document.querySelector('[data-hero]') as HTMLElement;
    if (!heroEl) return;

    const heroRect = heroEl.getBoundingClientRect();
    const heroCenter = heroRect.left + heroRect.width / 2 + window.scrollX;

    // Find the hero line end marker (where the hero's animated line ends)
    const heroLineEnd = document.querySelector('[data-hero-line-end]') as HTMLElement;
    let heroBottom: number;
    if (heroLineEnd) {
      // Use the marker's position - this is where the hero's SVG line ends
      let offsetTop = 0;
      let current: HTMLElement | null = heroLineEnd;
      while (current) {
        offsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }
      heroBottom = offsetTop;
    } else {
      // Fallback to section bottom
      heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
    }
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const isDesktop = window.innerWidth >= 1024;

    // Find all graphics in order
    const graphicIds = ['crane', 'blueprint', 'framework', 'skyline', 'completed'];
    const graphics: GraphicPosition[] = [];

    graphicIds.forEach(id => {
      const el = document.querySelector(`[data-graphic="${id}"]`) as HTMLElement;
      if (!el) return;

      // Get true vertical position by walking up the DOM
      let offsetTop = 0;
      let current: HTMLElement | null = el;
      while (current) {
        offsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }

      // Get horizontal center
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2 + window.scrollX;

      graphics.push({
        id,
        centerX: elCenterX,
        top: offsetTop,
        bottom: offsetTop + el.offsetHeight
      });
    });

    // Find Team section and heading
    let team: TeamPosition | null = null;
    const teamSection = document.querySelector('[data-team-section]') as HTMLElement;
    const teamHeading = document.querySelector('[data-team-heading]') as HTMLElement;

    if (teamSection && teamHeading) {
      // Get section position
      let sectionOffsetTop = 0;
      let current: HTMLElement | null = teamSection;
      while (current) {
        sectionOffsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }

      // Get heading position
      let headingOffsetTop = 0;
      current = teamHeading;
      while (current) {
        headingOffsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }

      // Get the content container inside the section (not the full-width section)
      const contentContainer = teamSection.querySelector('.container-wide') as HTMLElement;
      const containerRect = contentContainer ? contentContainer.getBoundingClientRect() : teamSection.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2 + window.scrollX;
      // Position line right at the content edges
      const leftEdge = containerRect.left + window.scrollX + 10;
      const rightEdge = containerRect.right + window.scrollX - 10;

      // Find all team members
      const members: TeamMemberPosition[] = [];
      const memberElements = document.querySelectorAll('[data-team-member]');
      memberElements.forEach((el) => {
        const memberEl = el as HTMLElement;
        const index = parseInt(memberEl.getAttribute('data-team-member') || '0', 10);
        // Get which side the name is on from data attribute (set in Team.tsx)
        const nameSide = (memberEl.getAttribute('data-team-member-side') as 'left' | 'right') || (index % 2 === 0 ? 'left' : 'right');

        // Get position
        let memberOffsetTop = 0;
        let curr: HTMLElement | null = memberEl;
        while (curr) {
          memberOffsetTop += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement;
        }

        members.push({
          index,
          top: memberOffsetTop,
          bottom: memberOffsetTop + memberEl.offsetHeight,
          nameSide
        });
      });

      // Sort by index
      members.sort((a, b) => a.index - b.index);

      team = {
        sectionTop: sectionOffsetTop,
        sectionBottom: sectionOffsetTop + teamSection.offsetHeight,
        headingTop: headingOffsetTop,
        headingBottom: headingOffsetTop + teamHeading.offsetHeight,
        centerX,
        leftEdge,
        rightEdge,
        members
      };
    }

    // Find News section
    let news: NewsPosition | null = null;
    const newsSection = document.querySelector('[data-news-section]') as HTMLElement;

    if (newsSection) {
      let newsOffsetTop = 0;
      let current: HTMLElement | null = newsSection;
      while (current) {
        newsOffsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }

      // Get the content container inside the section
      const contentContainer = newsSection.querySelector('.container-wide') as HTMLElement;
      const containerRect = contentContainer ? contentContainer.getBoundingClientRect() : newsSection.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2 + window.scrollX;
      const leftEdge = containerRect.left + window.scrollX + 10;

      news = {
        sectionTop: newsOffsetTop,
        sectionBottom: newsOffsetTop + newsSection.offsetHeight,
        centerX,
        leftEdge
      };
    }

    // Find Mailing List section and content container
    let mailing: MailingPosition | null = null;
    const mailingSection = document.querySelector('[data-mailing-section]') as HTMLElement;
    const mailingContent = document.querySelector('[data-mailing-content]') as HTMLElement;

    if (mailingSection && mailingContent) {
      let mailingOffsetTop = 0;
      let current: HTMLElement | null = mailingSection;
      while (current) {
        mailingOffsetTop += current.offsetTop;
        current = current.offsetParent as HTMLElement;
      }

      // Use content container for box width
      const contentRect = mailingContent.getBoundingClientRect();
      const centerX = contentRect.left + contentRect.width / 2 + window.scrollX;
      // On mobile, inset the box so it's visible on screen
      const mobileInset = isDesktop ? 0 : 15;
      const leftEdge = contentRect.left + window.scrollX + mobileInset;
      const rightEdge = contentRect.right + window.scrollX - mobileInset;

      mailing = {
        sectionTop: mailingOffsetTop,
        sectionBottom: mailingOffsetTop + mailingSection.offsetHeight,
        centerX,
        leftEdge,
        rightEdge
      };
    }

    // Calculate transition box positions
    const transitionBoxes: TransitionBoxConfig[] = [];

    if (graphics.length >= 5) {
      const [crane, blueprint, framework, skyline, completed] = graphics;

      // Turn Y positions (same as in FlowLines component)
      const craneToBlueprintTurnY = blueprint.top - 50;
      const blueprintToFrameworkTurnY = framework.top - 50;
      const frameworkToSkylineTurnY = skyline.top - 50;
      const skylineToCompletedTurnY2 = completed.top - 50;
      const sideMarginX = window.innerWidth - 80;

      // Box 1: Crane to Blueprint (turns LEFT)
      transitionBoxes.push({
        id: 'crane-to-blueprint',
        label: 'Asset owner',
        centerX: (crane.centerX + blueprint.centerX) / 2,
        centerY: craneToBlueprintTurnY,
        turnDirection: 'left'
      });

      // Box 2: Blueprint to Framework (turns RIGHT)
      transitionBoxes.push({
        id: 'blueprint-to-framework',
        label: 'Service provider',
        centerX: (blueprint.centerX + framework.centerX) / 2,
        centerY: blueprintToFrameworkTurnY,
        turnDirection: 'right'
      });

      // Box 3: Framework to Skyline (turns LEFT)
      transitionBoxes.push({
        id: 'framework-to-skyline',
        label: 'Income-driven Strategy',
        centerX: (framework.centerX + skyline.centerX) / 2,
        centerY: frameworkToSkylineTurnY,
        turnDirection: 'left'
      });

      // Box 4: Skyline to Completed (on second horizontal segment, turns LEFT after Projects)
      transitionBoxes.push({
        id: 'skyline-to-completed',
        label: 'Management',
        centerX: (sideMarginX + completed.centerX) / 2,
        centerY: skylineToCompletedTurnY2,
        turnDirection: 'left'
      });
    }

    // Calculate mobile transition box positions (within section, right after graphic)
    const mobileTransitionBoxes: TransitionBoxConfig[] = [];

    if (graphics.length >= 5 && !isDesktop) {
      const [crane, blueprint, framework, skyline] = graphics;

      // Mobile boxes positioned just below each graphic (within same section)
      // This creates flow: graphic → box → exits section → next section
      const pageCenter = window.innerWidth / 2;
      const boxOffset = 50; // Distance below the graphic

      // Box 1: After Crane (within crane section)
      mobileTransitionBoxes.push({
        id: 'mobile-crane-to-blueprint',
        label: 'Asset owner',
        centerX: pageCenter,
        centerY: crane.bottom + boxOffset,
        turnDirection: 'left',
        isMobile: true
      });

      // Box 2: After Blueprint (within blueprint section)
      mobileTransitionBoxes.push({
        id: 'mobile-blueprint-to-framework',
        label: 'Service provider',
        centerX: pageCenter,
        centerY: blueprint.bottom + boxOffset,
        turnDirection: 'right',
        isMobile: true
      });

      // Box 3: After Framework (within framework section)
      mobileTransitionBoxes.push({
        id: 'mobile-framework-to-skyline',
        label: 'Income-driven Strategy',
        centerX: pageCenter,
        centerY: framework.bottom + boxOffset,
        turnDirection: 'left',
        isMobile: true
      });

      // Box 4: After Skyline (within skyline section)
      mobileTransitionBoxes.push({
        id: 'mobile-skyline-to-completed',
        label: 'Management',
        centerX: pageCenter,
        centerY: skyline.bottom + boxOffset,
        turnDirection: 'left',
        isMobile: true
      });
    }

    setPositions({
      heroBottom,
      heroCenter,
      documentHeight,
      viewportHeight,
      graphics,
      team,
      mailing,
      news,
      isDesktop,
      transitionBoxes,
      mobileTransitionBoxes
    });
  }, []);

  useEffect(() => {
    calculate();
    // Multiple recalculations to catch late-rendering elements on mobile
    const t1 = setTimeout(calculate, 100);
    const t2 = setTimeout(calculate, 500);
    const t3 = setTimeout(calculate, 1000);
    const t4 = setTimeout(calculate, 2000);

    // Debounced resize handler to prevent excessive recalculations
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedCalculate = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculate, 150);
    };

    window.addEventListener('resize', debouncedCalculate);
    window.addEventListener('orientationchange', debouncedCalculate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedCalculate);
      window.removeEventListener('orientationchange', debouncedCalculate);
    };
  }, [calculate]);

  if (!positions || positions.graphics.length < 5) return null;

  return <FlowLines positions={positions} />;
}
