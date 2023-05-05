export class ImageUrlParserValueConverter {
  toView(imageUrl: string, shouldStrip = true): string {
    const image = imageUrl;

    if (image && shouldStrip) {
      return image.replace(/&draw.*$/, "");
    }
    return image;
  }
}
