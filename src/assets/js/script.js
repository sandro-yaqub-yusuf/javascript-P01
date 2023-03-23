let cart = [];    // Para controlar os itens que estão no carrinho de compras
let modalQt = 0;  // Guarda a quantidade da pizza selecionada
let modalKey = 0; // Para saber qual pizza foi selecionado no momento

const qs  = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

// Faz o mapeamento da variavel JSON "pizzaJSON" para varrer todos os elementos contidos nele
pizzaJson.map((item, index) => {
	// Clona a DIV ".pizza-item" para poder preencher os dados e depois exibi-las no formulário
	let pizzaItem = qs('.models .pizza-item').cloneNode(true);

	// Preenche os dados da DIV ".pizza-item" clonada
	pizzaItem.setAttribute('data-key', index); // Guarda a informação do INDEX de cada pizza mapeada
	pizzaItem.querySelector('.pizza-item--img img').src = item.img;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.prices[2].toFixed(2).replace(".", ",")}`;
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

	// Adiciona o evento CLICK para as tags A da DIV ".pizza-item"
	pizzaItem.querySelector('a').addEventListener('click', (e) => {
		e.preventDefault();

		// Pega o INDEX no atributo "data-key" na DIV ".pizza-item"
		let key = e.target.closest('.pizza-item').getAttribute('data-key');

		modalQt = 1;    // Seta uma quantidade padrão toda vez que uma pizza for selecionada
		modalKey = key; // Guarda o INDEX da pizza selecionada

		// Preenche os dados nas DIVs relacionadas
		qs('.pizzaBig img').src = pizzaJson[key].img;
		qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		qs('.pizzaInfo--size.selected').classList.remove('selected'); // Remove a seleção do tamanho

		// Seleciona o tamanho "GRANDE" da pizza selecionada
		qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
			if (sizeIndex == 2) size.classList.add('selected');

			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

			// Preenche o valor da pizza de acordo com o tamanho selecionado
			qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.prices[sizeIndex].toFixed(2).replace(".", ",")}`;
			qs('.pizzaInfo--qt').innerHTML = modalQt;
		});

		// Exibe o modal da DIV ".pizzaWindowArea"
		qs('.pizzaWindowArea').style.opacity = 0;
		qs('.pizzaWindowArea').style.display = 'flex';
		
		setTimeout(() => { qs('.pizzaWindowArea').style.opacity = 1; }, 200);
	});

	// Adiciona e exibe os dados da DIV ".pizza-item" clonada
	qs('.pizza-area').append(pizzaItem);
});

// Adiciona o evento CLICK para a DIVs ".pizzaInfo--cancelButton" e ".pizzaInfo--cancelMobileButton" (botão "Cancelar")
qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
	item.addEventListener('click', closeModal);
});

// Faz uma leitura em todos os tamanhos da pizza selecionada
qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    // Adiciona o evento CLICK para a DIV ".pizzaInfo--size.selected"
    size.addEventListener('click', () => {
		qs('.pizzaInfo--size.selected').classList.remove('selected'); // Remove a seleção do tamanho

        // Seleciona o tamanho escolhido pelo usuário
        size.classList.add('selected');

        // Exibe o preço da pizza de acordo com o tamanho selecionado
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].prices[sizeIndex].toFixed(2).replace(".", ",")}`;
	});
});

// Adiciona o evento CLICK para a DIV ".pizzaInfo--qtmais"
qs('.pizzaInfo--qtmais').addEventListener('click', () => {
	modalQt++;

    // Substitui a quantidade atual pela selecionada
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});

	// Adiciona o evento CLICK para a DIV ".pizzaInfo--qtmenos"
qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
	if (modalQt > 1) {
		modalQt--;

		// Substitui a quantidade atual pela selecionada
        qs('.pizzaInfo--qt').innerHTML = modalQt;
	}
});

// Adiciona o evento CLICK para a DIV ".pizzaInfo--addButton" (botão "Adicionar no carrinho")
qs('.pizzaInfo--addButton').addEventListener('click', () => {
	let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key')); // Pega o tamanho da pizza selecionada
	let identifier = (pizzaJson[modalKey].id + '@' + size); // Identificador para saber a pizza e o tamanho selecionados
	let key = cart.findIndex((item) => item.identifier == identifier); // Para saber se já tem a pizza e o tamanho no carrinho

	if (key > -1) {
		// Se já tiver a pizza e o tamanho no carrinho, apenas adiciona a quantidade
		cart[key].qt += modalQt;
	} else {
		// Adiciona a pizza e o tamanho selecionados no carrinho de compras
		cart.push({
			identifier,
			id: pizzaJson[modalKey].id,
			size,
			qt: modalQt,
			price: pizzaJson[modalKey].prices[size]
		});
	}

	updateCart(); // Atualiza e exibe as informações do carrinho de compras
	closeModal(); // Fecha o modal da DIV ".pizzaWindowArea"
});

// Adiciona o evento CLICK para a DIV ".menu-openner" (botão para abrir o carrinho de compras na versão mobile)
qs('.menu-openner').addEventListener('click', () => {
	if (cart.length > 0) qs('aside').style.left = '0';
});

// Adiciona o evento CLICK para a DIV ".menu-closer" (botão para fechar o carrinho de compras na versão mobile)
qs('.menu-closer').addEventListener('click', () => {
	qs('aside').style.left = '100vw';
});

// Função para fechar o modal da DIV ".pizzaWindowArea"
function closeModal() {
	qs('.pizzaWindowArea').style.opacity = 0;

	setTimeout(() => { 
		qs('.pizzaWindowArea').style.display = 'none';

		modalQt = 1;
	}, 500);
}

// Função para, de acordo com a seleção do tamanho da Pizza, retornar o nome correspondente
function getSizeName(pizzaItem) {
	switch (cart[pizzaItem].size) {
		case 0: return 'Pequena';
		case 1: return 'Média';
		case 2: return 'Grande';
	}
}

// Função para atualizar e exibir as informações do carrinho de compras
function updateCart() {
	qs('.menu-openner span').innerHTML = cart.length; // Adiciona a quantidade de pizzas selecionas no carrinho de compras para a versão mobile

	// Verifica se tem itens no carrinho de compras
	if (cart.length > 0) {
        qs('aside').classList.add('show');
		qs('.cart').innerHTML = ''; // Limpa os itens do carrinho de compras antes de atualizar as inormações

		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for (let i in cart) {
			let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); // Localiza a pizza que está no carrinho de compras na lista de pizzas

			// Clona a DIV ".cat--item" para poder preencher os dados e depois exibi-las no carrinho de compras
			let cartItem = qs('.models .cart--item').cloneNode(true);
			let pizzaSizeName = getSizeName(i); // Pega o nome do tamanho da pizza selecionada
			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; // Monta o nome da pizza selecionada com o tamanho

			// Preenche os dados da DIV ".cart--item" clonada
			cartItem.querySelector('img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

			// Adiciona o evento CLICK para as tags BUTTON da DIV ".cart--item-qtmenos"
			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				if (cart[i].qt > 1) cart[i].qt--;
				else cart.splice(i, 1); // Remove a pizza selecionada no carrinho de compras quando a quantidade for zero

				updateCart();
			});

			// Adiciona o evento CLICK para as tags BUTTON da DIV ".cart--item-qtmais"
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				cart[i].qt++;

				updateCart();
			});			

			subtotal += (cart[i].price * cart[i].qt);

			// Adiciona e exibe os dados da DIV ".cart" clonada
			qs('.cart').append(cartItem);
		}

		desconto = (subtotal * 0.1);
		total = (subtotal - desconto);

		// Exibe o Sub-Total, o Desconto e o Total do carrinho de compras
		qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
		qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace(".", ",")}`;
		qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`;

		qs('aside').classList.add('show'); // Exibe o carrinho de compras
	} else {
		qs('aside').classList.remove('show'); // Esconde o carrinho de compras na versão desktop e mobile
		qs('aside').style.left = '100vw';
	}
}
