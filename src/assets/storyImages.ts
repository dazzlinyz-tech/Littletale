import coverImage from './images/storybook_bunny_adventure_1792116362569.jpg';
import entranceImage from './images/story_scene_entrance_1792116639067.jpg';
import trailImage from './images/story_scene_trail_1792116640324.jpg';
import oakImage from './images/story_scene_oak_1792116640892.jpg';
import riverImage from './images/story_scene_river_1792116641863.jpg';
import cabinImage from './images/story_scene_cabin_1792116643561.jpg';
import porchImage from './images/story_scene_porch_1792116644424.jpg';
import basketImage from './images/story_scene_basket_1792116644731.jpg';
import partyImage from './images/story_scene_party_1792116645034.jpg';

export const STORY_IMAGES = {
  cover: coverImage,
  1: entranceImage,
  2: trailImage,
  3: oakImage,
  4: riverImage,
  5: cabinImage,
  6: porchImage,
  7: basketImage,
  8: partyImage,
  entrance: entranceImage,
  trail: trailImage,
  oak: oakImage,
  river: riverImage,
  cabin: cabinImage,
  porch: porchImage,
  basket: basketImage,
  party: partyImage,
} as const;

export const getStoryImageByPage = (pageNumber: number): string => {
  const img = STORY_IMAGES[pageNumber as keyof typeof STORY_IMAGES];
  return (img as string) || entranceImage;
};
