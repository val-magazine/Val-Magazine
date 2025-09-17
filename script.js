let carrinho = [];

// Carregar produtos
async function carregarProdutos() {
  try {
    const response = await fetch('produtos.json'); // nome corrigido
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
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})">Adicionar</button>
    `;
    lista.appendChild(card);
  });
}

// Adicionar no carrinho
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

  carrinho.forEach(item => {
    container.innerHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
    total += item.preco;
  });

  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Finalizar no WhatsApp
document.getElementById('checkout-btn').onclick = () => {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

  let mensagem = "Olá, gostaria de comprar:\n";
  let total = 0;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
    total += item.preco;
  });

  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

  const numero = "5577981543503"; // seu número WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
};

// Pesquisa
function configurarBusca(produtos) {
  document.getElementById('search').addEventListener('input', e => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    exibirProdutos(filtrados);
  });
}

// Filtro por categoria
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

carregarProdutos();
