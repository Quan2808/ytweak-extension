// Shared mutable state across modules.
// Using a plain object so all imports reference the same instance.
export const store = {
  previousState: 3, // 1=LIKED, 2=DISLIKED, 3=NEUTRAL
  likesValue: 0,
  dislikesValue: 0,
  mobileDislikes: 0,
  preNavigateLikeButton: null,
};
