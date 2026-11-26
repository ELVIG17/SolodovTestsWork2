const { createCart, addItem, removeItem, countItems } = require('../src/cart');

const book = { id: '1', title: 'Книга', price: 500, quantity: 1, category: 'books' };
const phone = { id: '2', title: 'Телефон', price: 20000, quantity: 1, category: 'electronics' };

describe('createCart', () => {
  test('возвращает пустой массив', () => {
    expect(createCart()).toEqual([]);
    expect(createCart()).toHaveLength(0);
  });
});

describe('addItem', () => {
  test('добавляет новый товар в пустую корзину', () => {
    const cart = addItem(createCart(), book);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual(book);
  });

  test('не мутирует исходную корзину (иммутабельность)', () => {
    const cart = createCart();
    addItem(cart, book);

    expect(cart).toHaveLength(0);
  });

  test('увеличивает количество существующего товара', () => {
    let cart = createCart();
    cart = addItem(cart, { ...book, quantity: 1 });
    cart = addItem(cart, { ...book, quantity: 2 });

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(3);
  });
});

describe('removeItem', () => {
  test('удаляет товар по id', () => {
    let cart = addItem(createCart(), book);
    cart = addItem(cart, phone);
    cart = removeItem(cart, book.id);

    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe('2');
  });

  test('не ломается, если товара с таким id нет', () => {
    let cart = addItem(createCart(), book);
    const result = removeItem(cart, 'не-существует');

    expect(result).toEqual(cart);
  });
});

describe('countItems', () => {
  test('считает сумму количеств, а не число позиций', () => {
    const cart = [
      { ...book, quantity: 2 },
      { ...phone, quantity: 5 },
    ];

    expect(countItems(cart)).toBe(7);
  });

  test('пустая корзина — 0', () => {
    expect(countItems(createCart())).toBe(0);
  });
});
