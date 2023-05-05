export class CeilValueConverter {
  toView(quantity: number): number {
    if (quantity) {
      return Math.ceil(quantity);
    }

    return null;
  }
}
