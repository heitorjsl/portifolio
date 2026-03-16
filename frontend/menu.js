const botaoMenu = document.querySelector('.menu-botao');
const menuItens = document.querySelector('.menu-itens');
botaoMenu.addEventListener('click', () => {
  menuItens.classList.toggle('aberto');
});