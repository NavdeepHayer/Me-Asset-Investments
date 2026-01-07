import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";

interface GraphicPosition {
  id: string;
  centerX: number;
  top: number;
  bottom: number;
}

interface TeamMemberPosition {
  index: number;
  centerX: number;
  centerY: number;
  isLeft: boolean; // true if on left side of grid (desktop)
}

interface TeamPosition {
  sectionTop: number;
  sectionBottom: number;
  headingTop: number;
  headingBottom: number;
  centerX: number;
  members: TeamMemberPosition[];
}

interface Positions {
  heroBottom: number;
  heroCenter: number;
  documentHeight: number;
  viewportHeight: number;
  graphics: GraphicPosition[];
  team: TeamPosition | null;
  isDesktop: boolean;
}

// Component for team member branch lines
function TeamBranch({
  member,
  mainLineStartY,
  mainLineEndY,
  centerX,
  scrollRange,
  scrollYProgress
}: {
  member: TeamMemberPosition;
  mainLineStartY: number;
  mainLineEndY: number;
  centerX: number;
  scrollRange: [number, number];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  // Calculate when the main line reaches this member's Y position
  // Map the member's Y within the main line's travel range to scroll progress
  const mainLineRange = mainLineEndY - mainLineStartY;
  const memberYRelative = member.centerY - mainLineStartY;
  const memberProgress = memberYRelative / mainLineRange; // 0 to 1 within the team section

  // Map to scroll range - branch starts when main line reaches member
  const scrollRangeSize = scrollRange[1] - scrollRange[0];
  const branchStart = scrollRange[0] + (memberProgress * scrollRangeSize);
  const branchEnd = Math.min(scrollRange[1], branchStart + 0.02); // Branch draws quickly

  const branchProgress = useTransform(
    scrollYProgress,
    [branchStart, branchEnd],
    [0, 1]
  );

  // Branch goes from center line to member
  const branchEndX = member.centerX;

  return (
    <motion.path
      d={`M ${centerX} ${member.centerY} L ${branchEndX} ${member.centerY}`}
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="2"
      strokeLinecap="round"
      filter="url(#glow-flow)"
      style={{ pathLength: branchProgress }}
    />
  );
}

// Child component that handles the scroll-linked animations
// This ensures hooks are always called consistently
function FlowLines({ positions }: { positions: Positions }) {
  const { heroBottom, heroCenter, documentHeight, viewportHeight, graphics, team, isDesktop } = positions;
  const [crane, blueprint, framework, skyline, completed] = graphics;
  const scrollableHeight = documentHeight - viewportHeight;

  const { scrollYProgress } = useScroll();

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

  // Calculate scroll ranges - line completes just before internal flow starts (local 0.10)
  // All segments use consistent timing: start slightly before element, complete at 0.08
  const ranges = useMemo(() => ({
    heroToCrane: [localToGlobal(crane, -0.05), localToGlobal(crane, 0.08)] as [number, number],
    craneToBlueprint: [localToGlobal(blueprint, -0.05), localToGlobal(blueprint, 0.08)] as [number, number],
    blueprintToFramework: [localToGlobal(framework, -0.05), localToGlobal(framework, 0.08)] as [number, number],
    frameworkToSkyline: [localToGlobal(skyline, -0.05), localToGlobal(skyline, 0.08)] as [number, number],
    // Skyline to completed: start after skyline internal flow completes (0.78), end at completed entry
    skylineToCompleted: [localToGlobal(skyline, 0.78), localToGlobal(completed, 0.08)] as [number, number],
    // Completed to Team: start after completed internal flow completes, draw through Team section
    completedToTeam: [localToGlobal(completed, 0.78), teamToGlobal(0.6)] as [number, number],
  }), [localToGlobal, teamToGlobal, crane, blueprint, framework, skyline, completed]);

  // Animated segments - tied to destination graphic's scroll position
  const heroToCrane = useTransform(scrollYProgress, ranges.heroToCrane, [0, 1]);
  const craneToBlueprint = useTransform(scrollYProgress, ranges.craneToBlueprint, [0, 1]);
  const blueprintToFramework = useTransform(scrollYProgress, ranges.blueprintToFramework, [0, 1]);
  const frameworkToSkyline = useTransform(scrollYProgress, ranges.frameworkToSkyline, [0, 1]);
  const skylineToCompleted = useTransform(scrollYProgress, ranges.skylineToCompleted, [0, 1]);
  const completedToTeam = useTransform(scrollYProgress, ranges.completedToTeam, [0, 1]);

  // Calculate turn points for 90° turns
  const heroToCraneTurnY = crane.top - 50;
  const craneToBlueprintTurnY = blueprint.top - 50;
  const blueprintToFrameworkTurnY = framework.top - 50;
  const frameworkToSkylineTurnY = skyline.top - 50;

  // For skyline to completed: route down the right side, around Projects
  const sideMarginX = window.innerWidth - 80; // Right edge of viewport
  const skylineToCompletedTurnY1 = skyline.bottom + 30; // First turn - go right
  const skylineToCompletedTurnY2 = completed.top - 50; // Second turn - go left toward completed

  // For completed to team: go down center, around heading, then through team section
  const teamCenterX = team ? team.centerX : heroCenter; // Center of viewport
  const headingAvoidX = teamCenterX + 120; // Go right just enough to clear heading
  const completedToTeamTurnY1 = team ? team.headingTop - 30 : 0; // Above heading - go right
  const completedToTeamTurnY2 = team ? team.headingBottom + 40 : 0; // Below heading - go back to center
  const teamSectionBottom = team ? team.sectionBottom - 50 : 0; // End point in team section

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      style={{
        width: '100%',
        height: documentHeight,
        zIndex: 0
      }}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow-flow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
          <motion.path
            d={`M ${crane.centerX} ${crane.bottom}
                L ${crane.centerX} ${craneToBlueprintTurnY}
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
          <motion.path
            d={`M ${blueprint.centerX} ${blueprint.bottom}
                L ${blueprint.centerX} ${blueprintToFrameworkTurnY}
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
          <motion.path
            d={`M ${framework.centerX} ${framework.bottom}
                L ${framework.centerX} ${frameworkToSkylineTurnY}
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
          {/* Skyline to Completed - goes down right side, around Projects */}
          <motion.path
            d={`M ${skyline.centerX} ${skyline.bottom}
                L ${skyline.centerX} ${skylineToCompletedTurnY1}
                L ${sideMarginX} ${skylineToCompletedTurnY1}
                L ${sideMarginX} ${skylineToCompletedTurnY2}
                L ${completed.centerX} ${skylineToCompletedTurnY2}
                L ${completed.centerX} ${completed.top}`}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow-flow)"
            style={{ pathLength: skylineToCompleted }}
          />
          {/* Completed to Team - goes down center, around heading, through team section */}
          {team && (
            <>
              <motion.path
                d={`M ${completed.centerX} ${completed.bottom}
                    L ${completed.centerX} ${completedToTeamTurnY1}
                    L ${headingAvoidX} ${completedToTeamTurnY1}
                    L ${headingAvoidX} ${completedToTeamTurnY2}
                    L ${teamCenterX} ${completedToTeamTurnY2}
                    L ${teamCenterX} ${teamSectionBottom}`}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-flow)"
                style={{ pathLength: completedToTeam }}
              />
              {/* Branch lines to each team member */}
              {team.members.map((member) => (
                <TeamBranch
                  key={member.index}
                  member={member}
                  mainLineStartY={completedToTeamTurnY2}
                  mainLineEndY={teamSectionBottom}
                  centerX={teamCenterX}
                  scrollRange={ranges.completedToTeam}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </>
          )}
        </>
      ) : (
        <>
          <motion.line
            x1={heroCenter} y1={heroBottom}
            x2={crane.centerX} y2={crane.top}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-flow)"
            style={{ pathLength: heroToCrane }}
          />
          <motion.line
            x1={crane.centerX} y1={crane.bottom}
            x2={blueprint.centerX} y2={blueprint.top}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-flow)"
            style={{ pathLength: craneToBlueprint }}
          />
          <motion.line
            x1={blueprint.centerX} y1={blueprint.bottom}
            x2={framework.centerX} y2={framework.top}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-flow)"
            style={{ pathLength: blueprintToFramework }}
          />
          <motion.line
            x1={framework.centerX} y1={framework.bottom}
            x2={skyline.centerX} y2={skyline.top}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-flow)"
            style={{ pathLength: frameworkToSkyline }}
          />
          <motion.line
            x1={skyline.centerX} y1={skyline.bottom}
            x2={completed.centerX} y2={completed.top}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow-flow)"
            style={{ pathLength: skylineToCompleted }}
          />
          {team && (
            <>
              <motion.line
                x1={completed.centerX} y1={completed.bottom}
                x2={teamCenterX} y2={teamSectionBottom}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow-flow)"
                style={{ pathLength: completedToTeam }}
              />
              {/* Branch lines to each team member */}
              {team.members.map((member) => (
                <TeamBranch
                  key={member.index}
                  member={member}
                  mainLineStartY={completed.bottom}
                  mainLineEndY={teamSectionBottom}
                  centerX={teamCenterX}
                  scrollRange={ranges.completedToTeam}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </>
          )}
        </>
      )}
    </svg>
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

      // Get horizontal center
      const sectionRect = teamSection.getBoundingClientRect();
      const centerX = sectionRect.left + sectionRect.width / 2 + window.scrollX;

      // Find all team members
      const members: TeamMemberPosition[] = [];
      const memberElements = document.querySelectorAll('[data-team-member]');
      memberElements.forEach((el) => {
        const memberEl = el as HTMLElement;
        const index = parseInt(memberEl.getAttribute('data-team-member') || '0', 10);

        // Get position
        let memberOffsetTop = 0;
        let curr: HTMLElement | null = memberEl;
        while (curr) {
          memberOffsetTop += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement;
        }

        const memberRect = memberEl.getBoundingClientRect();
        const memberCenterX = memberRect.left + memberRect.width / 2 + window.scrollX;
        const memberCenterY = memberOffsetTop + memberEl.offsetHeight / 2;

        // On desktop 2-col grid: even indices are left (0, 2, 4), odd are right (1, 3, 5)
        // But we need to check actual position relative to center
        const isLeft = memberCenterX < centerX;

        members.push({
          index,
          centerX: memberCenterX,
          centerY: memberCenterY,
          isLeft
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
        members
      };
    }

    setPositions({
      heroBottom,
      heroCenter,
      documentHeight,
      viewportHeight,
      graphics,
      team,
      isDesktop
    });
  }, []);

  useEffect(() => {
    calculate();
    // Multiple recalculations to catch late-rendering elements on mobile
    const t1 = setTimeout(calculate, 100);
    const t2 = setTimeout(calculate, 500);
    const t3 = setTimeout(calculate, 1000);
    const t4 = setTimeout(calculate, 2000);

    window.addEventListener('resize', calculate);
    window.addEventListener('orientationchange', calculate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('resize', calculate);
      window.removeEventListener('orientationchange', calculate);
    };
  }, [calculate]);

  if (!positions || positions.graphics.length < 5) return null;

  return <FlowLines positions={positions} />;
}
