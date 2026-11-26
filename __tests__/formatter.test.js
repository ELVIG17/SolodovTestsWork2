const { formatPrice, pluralizeItems } = require('../src/formatter');

describe('formatPrice', () => {
  test('форматирует число с копейками и разделителями разрядов', () => {
    expect(formatPrice(1234.5)).toBe('1 234,50 ₽');
  });
 j
  test('бросает ошибку для не-числа', () => {
    expect(() => formatPrice('100')).toThrow('Amount must be a number');
  });

  test('бросает ошибку для NaN', () => {
    expect(() => formatPrice(NaN)).toThrow('Amount must be a number');
  });
});

describe('pluralizeItems', () => {
  test('1 → "1 товар"', () => {
    expect(pluralizeItems(1)).toBe('1 товар');
  });

  test('3 → "3 товара"', () => {
    expect(pluralizeItems(3)).toBe('3 товара');
  });

  test('11 → "11 товаров"', () => {
    expect(pluralizeItems(11)).toBe('11 товаров');
  });
});
