var React = require('react');
// Graças a utilização do browserify, o componente abaixo está compartilhado entre front e back end
var App = React.createFactory(require('./App'));

// Este script irá rodar no browser e renderizar nosso componente utilizando
// valores do APP_PROPS que fora declarado no lado do servidor no html principal.
// Como as informações do APP_PROPS já estava declarada no lado do servidor   
// o React não irá gerar novamente, deixando o DOM limpo e a inicialização mais rápida

React.render(App(window.APP_PROPS), document.getElementById('content'));
