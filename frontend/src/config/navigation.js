import {
  GlobeAltIcon,
  PlusCircleIcon,
  BookmarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

/** Primary nav items — desktop center + mobile drawer */
export const primaryNavItems = [
  { to: '/explore', label: 'Feed', icon: GlobeAltIcon },
];

/** Auth-only primary nav additions */
export const authNavItems = [
  { to: '/create', label: 'Share', icon: PlusCircleIcon },
  { to: '/saved', label: 'Saved', icon: BookmarkIcon },
];

/** Account dropdown / profile utilities */
export const accountNavItems = [
  { to: (userId) => `/profile/${userId}`, label: 'My Profile', icon: UserCircleIcon },
];
