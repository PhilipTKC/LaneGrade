export class ToNumberValueConverter {
  toView(number: string): number {
    if (number) {
      return Number(number);
    }

    return null;
  }
}
