// Shared mutable state across all modules.
export const store = {
  previousState: 3, // 1=LIKED, 2=DISLIKED, 3=NEUTRAL
  likesValue: 0,
  dislikesValue: 0,
  mobileDislikes: 0,
  preNavigateLikeButton: null,
  currentVideoId: null, // track để detect video change

  // Cached DOM references — cleared on each navigation
  _buttons: null,
  _likeButton: null,
  _dislikeButton: null,

  clearCache() {
    this._buttons = null;
    this._likeButton = null;
    this._dislikeButton = null;
  },

  reset() {
    this.previousState = 3;
    this.likesValue = 0;
    this.dislikesValue = 0;
    this.preNavigateLikeButton = null;
    this.clearCache();
  },
};
