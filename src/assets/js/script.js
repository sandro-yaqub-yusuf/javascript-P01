let cart = [];
let modalQt = 1;
let modalKey = 0;
let pizzaPriceBase = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
	let pizzaItem = c('.models .pizza-item').cloneNode(true);
	let priceSell = item.price + 30; // Seta o valor da pizza tamanho "GRANDE" na página principal
	
	// Exibe os dados da pizza na página principal
	pizzaItem.setAttribute('data-key', index);
	pizzaItem.querySelector('.pizza-item--img img').src = item.img;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${priceSell.toFixed(2).replace(".", ",")}`;
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

	pizzaItem.querySelector('a').addEventListener('click', (e) => {
		e.preventDefault();

		let key = e.target.closest('.pizza-item').getAttribute('data-key');
		
		pizzaPriceBase = pizzaJson[key].price; // Pega o valor de base da pizza para efetuar o calculo de acordo com o tamanho
		
		let pizzaPriceSell = pizzaPriceBase;   // Pega o valor de base da pizza para efetuar o calculo de acordo com o tamanho

		modalKey = key;

		c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		c('.pizzaBig img').src = pizzaJson[key].img;
		c('.pizzaInfo--size.selected').classList.remove('selected');

		cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
			if (sizeIndex == 2) {
				pizzaPriceSell += 30; // Seta o valor da pizza tamanho "GRANDE" na página principal
				
				size.classList.add('selected');
			}

			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
		});

		c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaPriceSell.toFixed(2).replace(".", ",")}`;
		c('.pizzaInfo--qt').innerHTML = modalQt;

		c('.pizzaWindowArea').style.opacity = 0;
		c('.pizzaWindowArea').style.display = 'flex';

		setTimeout(() => {
			c('.pizzaWindowArea').style.opacity = 1;
		}, 200);
	});
    
	c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
function closeModal() {
	c('.pizzaWindowArea').style.opacity = 0;

	setTimeout(() => {
		c('.pizzaWindowArea').style.display = 'none';

		modalQt = 1;
	}, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
	item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
	if (modalQt > 1) {
		modalQt--;

		c('.pizzaInfo--qt').innerHTML = modalQt;
	}
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
	modalQt++;

	c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
	size.addEventListener('click', () => {
		c('.pizzaInfo--size.selected').classList.remove('selected');

		size.classList.add('selected');

		let pizzaPriceSell = pizzaPriceBase;

		// De acordo com a seleção do tamanho da Pizza, calcula o valor correspondente
        if (sizeIndex == 0) {
			pizzaPriceSell += 10; // Seta o valor da pizza tamanho "PEQUENO" no modal de seleção
		}
        else if (sizeIndex == 1) {
			pizzaPriceSell += 20; // Seta o valor da pizza tamanho "MÉDIO" no modal de seleção
		}
        else if (sizeIndex == 2) {
			pizzaPriceSell += 30; // Seta o valor da pizza tamanho "GRANDE" no modal de seleção
		}

		c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaPriceSell.toFixed(2).replace(".", ",")}`;
	});
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
	let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
	let identifier = pizzaJson[modalKey].id + '@' + size;
	let key = cart.findIndex((item) => item.identifier == identifier);

	if (key > -1) {
		cart[key].qt += modalQt;
	} else {
		cart.push({
			identifier,
			id: pizzaJson[modalKey].id,
			size,
			qt: modalQt
		});
	}

	updateCart();
	closeModal();
});

c('.menu-openner').addEventListener('click', () => {
	if (cart.length > 0) {
		c('aside').style.left = '0';
	}
});

c('.menu-closer').addEventListener('click', () => {
	c('aside').style.left = '100vw';
});

function updateCart() {
	c('.menu-openner-desk span').innerHTML = cart.length;
	c('.menu-openner span').innerHTML = cart.length;

	if (cart.length > 0) {
		c('aside').classList.add('show');
		c('.menu-openner-desk').classList.add('show');
		c('.cart').innerHTML = '';

		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for (let i in cart) {
			let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

			let cartItem = c('.models .cart--item').cloneNode(true);

			let pizzaSizeName;

			// De acordo com a seleção do tamanho da Pizza, calcula o valor do subtotal correspondente
			switch (cart[i].size) {
				case 0:
					subtotal += ((pizzaItem.price + 10) * cart[i].qt); // Seta o subtotal da pizza tamanho "PEQUENO" no carrinho
					pizzaSizeName = 'Pequena';
					break;
				case 1:
					subtotal += ((pizzaItem.price + 20) * cart[i].qt); // Seta o subtotal da pizza tamanho "MÉDIO" no carrinho
					pizzaSizeName = 'Média';
					break;
				case 2:
					subtotal += ((pizzaItem.price + 30) * cart[i].qt); // Seta o subtotal da pizza tamanho "GRANDE" no carrinho
					pizzaSizeName = 'Grande';
					break;
			}

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

			cartItem.querySelector('img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				if (cart[i].qt > 1) {
					cart[i].qt--;
				} else {
					cart.splice(i, 1);
				}

				updateCart();
			});

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				cart[i].qt++;

				updateCart();
			});
			
			c('.cart').append(cartItem);
		}

		desconto = (subtotal * 0.1);
		total = (subtotal - desconto);

		c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
		c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace(".", ",")}`;
		c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`;
	} else {
		c('aside').classList.remove('show');
		c('.menu-openner-desk').classList.remove('show');
		c('aside').style.left = '100vw';
	}
}
