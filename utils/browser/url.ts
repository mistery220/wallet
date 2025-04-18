export function getFormattedUrl(searchString: string) {
  let formattedUrl = searchString.trim();
  if (
    !formattedUrl.startsWith("http://") &&
    !formattedUrl.startsWith("https://")
  ) {
    return (
      "https://www.google.com/search?q=" + encodeURIComponent(formattedUrl)
    );
  }
  return formattedUrl;
}
