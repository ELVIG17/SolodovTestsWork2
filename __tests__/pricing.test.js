const {
  getQuantityDiscount,
  getCategoryDiscount,
  getTotal,
} = require('../src/pricing');

describe('getQuantityDiscount', () => {
  const item = (quantity) => ({
    id: '1', title: 'Товар', price: 100, quantity, category: 'books',
  });

  test('2 шт — скидки нет', () => {
    expect(getQuantityDiscount(item(2))).toBe(0);
  });

  test('3 шт — ровно 5% (граница включена)', () => {
    expect(getQuantityDiscount(item(3))).toBeCloseTo(15); // 300 * 0.05
  });

  test('4 шт — ещё 5%', () => {
    expect(getQuantityDiscount(item(4))).toBeCloseTo(20); // 400 * 0.05
  });

  test('5 шт — ровно 10%', () => {
    expect(getQuantityDiscount(item(5))).toBeCloseTo(50); // 500 * 0.10
  });

  test('9 шт — ещё 10%', () => {
    expect(getQuantityDiscount(item(9))).toBeCloseTo(90); // 900 * 0.10
  });

  test('10 шт — ровно 15%', () => {
    expect(getQuantityDiscount(item(10))).toBeCloseTo(150); // 1000 * 0.15
  });
});

describe('getCategoryDiscount', () => {
  test('книги — 5% всегда', () => {
    const cart = [{ id: '1', title: 'Книга', price: 200, quantity: 1, category: 'books' }];
    expect(getCategoryDiscount(cart)).toBeCloseTo(10); // 200 * 0.05
  });

  test('электроника без скидки, пока subtotal < 10000', () => {
    const cart = [
      { id: '1', title: 'Наушники', price: 5000, quantity: 1, category: 'electronics' },
      { id: '2', title: 'Книга', price: 100, quantity: 1, category: 'books' },
    ];
    // subtotal = 5100 < 10000 → скидка только на книги: 100 * 0.05 = 5
    expect(getCategoryDiscount(cart)).toBeCloseTo(5);
  });

  test('книги и электроника при subtotal ≥ 10000', () => {
    const cart = [
      { id: '1', title: 'Книга', price: 500, quantity: 3, category: 'books' },
      { id: '2', title: 'Ноутбук', price: 20000, quantity: 1, category: 'electronics' },
    ];
    // subtotal = 21500 ≥ 10000
    // книги: 1500 * 0.05 = 75, электроника: 20000 * 0.07 = 1400
    expect(getCategoryDiscount(cart)).toBeCloseTo(1475);
  });
});

describe('getTotal', () => {
  test('обычная корзина: total = subtotal − все скидки', () => {
    const cart = [
      { id: '1', title: 'Книга', price: 500, quantity: 3, category: 'books' },
      { id: '2', title: 'Ноутбук', price: 20000, quantity: 1, category: 'electronics' },
    ];
    // subtotal = 21500
    // скидка за количество: книга (3 шт) 5% → 75
    // категория: книги 75 + электроника 1400 = 1475
    // опт: 4 шт < 10 → 0
    expect(getTotal(cart)).toBe(21500 - 75 - 1475);
  });

  test('итог не уходит в минус', () => {
    const cart = [
      { id: '1', title: 'Странная позиция', price: -50, quantity: 2, category: 'books' },
    ];
    // subtotal = -100 → без Math.max итог был бы отрицательным
    expect(getTotal(cart)).toBe(0);
  });
});
