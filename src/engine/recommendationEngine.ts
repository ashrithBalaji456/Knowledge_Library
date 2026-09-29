import { Resource, Relationship } from '../types/library';

export interface RecommendationItem {
  resource: Resource;
  type: 'PREREQUISITE' | 'NEXT' | 'RELATED' | 'ADVANCED' | 'PRACTICAL' | 'ALTERNATIVE';
  reason: string;
}

export interface RecommendationResult {
  learnFirst: RecommendationItem[];
  learnNext: RecommendationItem[];
  related: RecommendationItem[];
  advanced: RecommendationItem[];
  practical: RecommendationItem[];
}

export function computeRecommendations(
  selectedResource: Resource,
  allResources: Resource[],
  relationships: Relationship[]
): RecommendationResult {
  const resourceMap = new Map<string, Resource>();
  allResources.forEach((r) => resourceMap.set(r.id, r));

  const learnFirst: RecommendationItem[] = [];
  const learnNext: RecommendationItem[] = [];
  const related: RecommendationItem[] = [];
  const advanced: RecommendationItem[] = [];
  const practical: RecommendationItem[] = [];

  // 1. Direct explicit graph relationships
  relationships.forEach((rel) => {
    // If selected is target, then source is a prerequisite or builds-on predecessor
    if (rel.targetId === selectedResource.id) {
      const source = resourceMap.get(rel.sourceId);
      if (source) {
        if (rel.type === 'PREREQUISITE' || rel.type === 'BUILDS_ON') {
          learnFirst.push({
            resource: source,
            type: 'PREREQUISITE',
            reason: rel.reason || `Essential foundation before studying ${selectedResource.title}.`,
          });
        } else {
          related.push({
            resource: source,
            type: 'RELATED',
            reason: rel.reason || `Connected foundational topic.`,
          });
        }
      }
    }

    // If selected is source, then target is next, advanced, or practical
    if (rel.sourceId === selectedResource.id) {
      const target = resourceMap.get(rel.targetId);
      if (target) {
        if (rel.type === 'NEXT') {
          learnNext.push({
            resource: target,
            type: 'NEXT',
            reason: rel.reason || `Natural progression after mastering ${selectedResource.title}.`,
          });
        } else if (rel.type === 'ADVANCED' || rel.type === 'DEEPER_DIVE') {
          advanced.push({
            resource: target,
            type: 'ADVANCED',
            reason: rel.reason || `In-depth mastery and mechanical dive into internal semantics.`,
          });
        } else if (rel.type === 'PRACTICAL' || rel.type === 'INTERVIEW') {
          practical.push({
            resource: target,
            type: 'PRACTICAL',
            reason: rel.reason || `Real-world hands-on application and interview problem patterns.`,
          });
        } else {
          related.push({
            resource: target,
            type: 'RELATED',
            reason: rel.reason || `Related topic in this domain.`,
          });
        }
      }
    }
  });

  // 2. Fallback heuristic matching if explicit relationships are sparse
  if (learnNext.length === 0) {
    const sameCategoryCandidates = allResources.filter(
      (r) =>
        r.id !== selectedResource.id &&
        r.category === selectedResource.category &&
        r.status !== 'COMPLETED'
    );

    // Pick candidate with slightly higher difficulty or related tags
    for (const cand of sameCategoryCandidates) {
      const sharedTags = cand.tags.filter((t) => selectedResource.tags.includes(t));
      if (sharedTags.length > 0) {
        learnNext.push({
          resource: cand,
          type: 'NEXT',
          reason: `Recommended next because it shares core concepts (${sharedTags.slice(0, 2).join(', ')}) in ${selectedResource.category}.`,
        });
        break;
      }
    }
  }

  // 3. Related topics by tag overlap
  if (related.length === 0) {
    const candidatesWithSharedTags = allResources
      .filter((r) => r.id !== selectedResource.id)
      .map((r) => ({
        res: r,
        overlap: r.tags.filter((t) => selectedResource.tags.includes(t)).length,
      }))
      .filter((item) => item.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap);

    for (let i = 0; i < Math.min(3, candidatesWithSharedTags.length); i++) {
      const item = candidatesWithSharedTags[i];
      related.push({
        resource: item.res,
        type: 'RELATED',
        reason: `Shares knowledge themes including ${item.res.tags.slice(0, 2).join(', ')}.`,
      });
    }
  }

  return {
    learnFirst,
    learnNext,
    related,
    advanced,
    practical,
  };
}
