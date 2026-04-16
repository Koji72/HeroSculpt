import { ArchetypeId, Part, SelectedParts } from '../types';

const AI_BACKEND_REQUIRED_MESSAGE =
  'AI Designer is disabled in the browser build. Route AI requests through a backend service.';

export const generateBuild = async (
  _prompt: string,
  _allParts: Part[],
  _archetype: ArchetypeId
): Promise<SelectedParts> => {
  throw new Error(AI_BACKEND_REQUIRED_MESSAGE);
};

export const isAIServiceAvailable = (): boolean => false;
