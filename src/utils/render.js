/**
 * setLayout allows to display specific information in an HTML template
 * containing those paramters as id to text elements (h4, h5, title)
 * @param {pageTitle} pageTitle
 * @param {headerTitle} headerTitle
 * @param {footerText} footerText
 */
function setLayout(pageTitle, footerText) {
  if (pageTitle) {
    document.querySelector("title").innerText = pageTitle;
    document.querySelector("#pageTitle").innerText = pageTitle;
  }
  if (footerText) document.querySelector("#footerText").innerText = footerText;
}
// named export
export { setLayout };
