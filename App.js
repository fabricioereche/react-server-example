var React  = require('react');
var DOM    = React.DOM;
var button = DOM.button;
var div    = DOM.div;
var ul     = DOM.ul;
var li     = DOM.li;

module.exports = React.createClass({

  // Inicialmente ele busca as propriedades já renderizadas pelo server
  // e deixamos o botão desabilitado inicialmente para que seja habilitado
  // apenas quando todo o componente estiver carregado
  getInitialState: function() {
    return {items: this.props.items, disabled: true}
  },

  // Quando todo o componente estiver carregado, habilita o botão
  componentDidMount: function() {
    this.setState({disabled: false})
  },

  // Este handler apenas adiciona um novo item na lista atual
  // isso pode ser alterado para chamadas AJAX em um servidor, para atualização
  // inclusão ou enfim, muita coisa pode ser feita nessa brincadeira
  handleClick: function() {
    this.setState({
      items: this.state.items.concat('Item ' + this.state.items.length)
    })
  },

  // A ideia desse exemplo é ser o mais simples possível
  // logo, foi optado a remoção da compilação de um código JSX, deixando JS puro
  // Note que o botão fica desabilitado, até que tudo esteja completamente carregado
  render: function() {

    return div(null,

      button({onClick: this.handleClick, disabled: this.state.disabled}, 'Adiciona Item'),

      ul({children: this.state.items.map(function(item) {
        return li(null, item)
      })})

    )
  },
})
