const noop = () => null;

export const fixMissalignedVideos = (() => {
  let hasRun = false;

  return () => {
    if (hasRun) return noop();
    hasRun = true;

    return `
            /* Fix misalignment for normal videos */
            ytd-rich-item-renderer[rendered-from-rich-grid]:not([is-shorts-grid]) {
                width: calc(100% / var(--ytd-rich-grid-items-per-row) - var(--ytd-rich-grid-item-margin) - 0.01px) !important;
                margin-left: calc(var(--ytd-rich-grid-item-margin) / 2) !important;
                margin-right: calc(var(--ytd-rich-grid-item-margin) / 2) !important;
            }

            /* Fix container width */
            [is-default-grid] > #contents.ytd-rich-grid-renderer {
                width: calc(100% - 32px) !important;
                max-width: calc(var(--ytd-rich-grid-items-per-row) * (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin))) !important;
            }

            #content.ytd-rich-section-renderer {
                margin: 0 8px !important;
            }

            .ghost-grid.ytd-ghost-grid-renderer {
                margin: 0 !important;
            }
        `;
  };
})();
