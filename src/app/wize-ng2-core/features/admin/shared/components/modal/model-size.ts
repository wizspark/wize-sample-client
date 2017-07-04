export class ModalSize {
  public static Small = 'sm';
  public static Large = 'lg';

  public static validSize(size: string) {
    return size && (size === ModalSize.Small || size === ModalSize.Large);
  }
}
