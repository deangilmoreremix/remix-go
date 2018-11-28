/**
 * Created by Eugene Butusov on 29/11/2018.
 */

export default (id, theme) => `

.theme-${id} .search-template .search-field .search-button a img.search-icon path,
.theme-${id} .search-template .search-field .search-button a svg.search-icon path {
  fill: ${theme.primaryColor};
}


.theme-${id} .loop-disabled-icon .cls-1,
.theme-${id} .loop-enabled-icon .cls-1,
.theme-${id} .pause-cta-enabled-icon .cls-1,
.theme-${id} .pause-cta-disabled-icon .cls-1,
.theme-${id} .facebook-enabled-icon .cls-1,
.theme-${id} .facebook-disabled-icon .cls-1,
.theme-${id} .linkedin-enabled-icon .cls-1,
.theme-${id} .linkedin-disabled-icon .cls-1,
.theme-${id} .new-text-icon .cls-1,
.theme-${id} .new-text-icon .cls-2,
.theme-${id} .new-image-icon .cls-1,
.theme-${id} .new-personalized-icon .cls-1,
.theme-${id} .cta-icon .cls-1,
.theme-${id} .cta-icon .cls-2,
.theme-${id} .cta-icon .cls-3,
.theme-${id} .personalizer-icon .cls-1,
.theme-${id} .personalizer-icon .cls-2,
.theme-${id} .personalizer-icon .cls-3,
.theme-${id} .niche-scripts-icon .cls-1,
.theme-${id} .niche-scripts-icon .cls-2,
.theme-${id} .niche-scripts-icon .cls-3,
.theme-${id} .video-upload-icon .cls-1,
.theme-${id} .video-upload-icon .cls-2,
.theme-${id} .template-generator-icon .cls-1,
.theme-${id} .template-generator-icon .cls-2,
.theme-${id} .from-template-icon .cls-1,
.theme-${id} .from-template-icon .cls-2,
.theme-${id} .from-template-icon .cls-3 {
  stroke: ${theme.primaryColor};
}

.theme-${id} .loop-enabled-icon .cls-1,
.theme-${id} .pause-cta-enabled-icon .cls-1,
.theme-${id} .facebook-enabled-icon .cls-1,
.theme-${id} .linkedin-enabled-icon .cls-1,
.theme-${id} .personalizer-icon .cls-2,
.theme-${id} .cta-icon .cls-2,
.theme-${id} .niche-scripts-icon .cls-3,
.theme-${id} .template-generator-icon .cls-2,
.theme-${id} .video-upload-icon .cls-1,
.theme-${id} .from-template-icon .cls-2 {
  fill: ${theme.phaseHighlightColor};
}
`;
