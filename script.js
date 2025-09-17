let carrinho = [];

// Carregar produtos
async function carregarProdutos() {
  try {
    const response = await fetch('produtos.json');
    const produtos = await response.json();
    exibirProdutos(produtos);
    configurarBusca(produtos);
    configurarCategorias(produtos);
  } catch (e) {
    console.error("Erro ao carregar produtos:", e);
    document.getElementById('product-list').innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

// Exibir produtos
function exibirProdutos(produtos) {
  const lista = document.getElementById('product-list');
  lista.innerHTML = '';

  if (!produtos || produtos.length === 0) {
    lista.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="clickable-img">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})">Adicionar</button>
    `;
    lista.appendChild(card);

    // Clique na imagem abre modal
    card.querySelector('.clickable-img').addEventListener('click', () => {
      abrirModalProduto(produto);
    });
  });
}

// Adicionar ao carrinho
function adicionarAoCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  document.getElementById('cart-count').textContent = carrinho.length;
}

// Modal carrinho
const modal = document.getElementById('cart-modal');
document.getElementById('cart-btn').onclick = () => {
  atualizarCarrinho();
  modal.style.display = 'flex';
};
document.getElementById('close-cart').onclick = () => {
  modal.style.display = 'none';
};
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = 'none';
};

// Atualizar carrinho
function atualizarCarrinho() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    container.innerHTML += `
      <p>
        ${item.nome} - R$ ${item.preco.toFixed(2)}
        <button onclick="removerDoCarrinho(${index})">❌</button>
      </p>
    `;
    total += item.preco;
  });

  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Remover item do carrinho
function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  document.getElementById('cart-count').textContent = carrinho.length;
  atualizarCarrinho();
}

// Checkout WhatsApp do carrinho
document.getElementById('checkout-btn').onclick = () => {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

  let mensagem = "Olá, gostaria de comprar:\n";
  let total = 0;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
    total += item.preco;
  });

  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

  const numero = "5577981543503"; 
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
};

// Busca
function configurarBusca(produtos) {
  document.getElementById('search').addEventListener('input', e => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    exibirProdutos(filtrados);
  });
}

// Categorias
function configurarCategorias(produtos) {
  document.querySelectorAll('.category').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.category;
      if (categoria === 'all') {
        exibirProdutos(produtos);
      } else {
        const filtrados = produtos.filter(
          p => p.categoria.toLowerCase() === categoria.toLowerCase()
        );
        exibirProdutos(filtrados);
      }
    });
  });
}

// Modal Produto Aprimorado
const productModal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalBuyBtn = document.getElementById('modal-buy-btn');
const modalAddCart = document.getElementById('modal-add-cart');

document.getElementById('close-product-modal').onclick = () => {
  productModal.style.display = 'none';
};

function abrirModalProduto(produto) {
  modalImg.src = produto.imagem;
  modalName.textContent = produto.nome;
  modalPrice.textContent = `R$ ${produto.preco.toFixed(2)}`;

  // Botão Comprar WhatsApp
  modalBuyBtn.onclick = () => {
    const numero = "5577981543503";
    const mensagem = `Olá, gostaria de comprar: ${produto.nome} por R$ ${produto.preco.toFixed(2)}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  // Botão Adicionar ao Carrinho
  modalAddCart.onclick = () => {
    adicionarAoCarrinho(produto.nome, produto.preco);
    alert(`${produto.nome} adicionado ao carrinho!`);
    productModal.style.display = 'none';
  };

  productModal.style.display = 'flex';
}

// Fechar modal clicando fora
window.addEventListener('click', e => {
  if (e.target === productModal) productModal.style.display = 'none';
});

carregarProdutos();
