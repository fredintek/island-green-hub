export function cleanAndSplitHTML(htmlString: string) {
  // Remove <br> tags and replace with a newline for splitting
  const cleanedHtml = htmlString?.replace(/<br\s*\/?>/gi, "\n");

  // Remove all other HTML tags
  const plainText = cleanedHtml?.replace(/<\/?[^>]+(>|$)/g, "");

  // Split the text by newlines and filter out empty lines
  return plainText
    ?.split("\n")
    ?.map((line) => line.trim())
    ?.filter((line) => line !== "");
}

export function splitByBr(htmlString: string): string[] {
  return htmlString
    ?.split(/<p><br><\/p>/gi) // Split at <p><br></p>
    ?.map((line) =>
      line
        .trim()
        .replace(
          /<strong>(.*?)<\/strong>/gi,
          '<p class="text-secondaryShade">$1</p>'
        )
        .replace(/<a /g, `<a class="text-primaryShade" `)
    )
    ?.filter((line) => line !== ""); // Remove empty lines
}
