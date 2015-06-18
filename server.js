var browserify = require('browserify');
var literalify = require('literalify');
var React      = require('react');
var http       = require('http');
var DOM        = React.DOM;
var body       = DOM.body;
var div        = DOM.div;
var script     = DOM.script;

// Este componente, está compartilhado com o browser, graças a utilização do browserify
var App = React.createFactory(require('./App'));


// Cria uma resposta http simples no servidor que responde aos endpoints ('/' e
// '/bundle.js') Em um mundo real de produção, usariamos uma biblioteca/framework
// como o Express ou outros
http.createServer(function(req, res) {

  // Quando acessarmos o endpoint principal, então vamos renderizar HTML
  // utilizando o server-side para renderizar um componente React
  // assim como os scripts a serem usados no lado do cliente
  if (req.url == '/') {

    res.setHeader('Content-Type', 'text/html');

    // `props` representa dados para o componente do React
    // para renderização, assim como é passado dados para templates
    // como Jade or Handlebars. Usamos informações fixas aqui
    // (com potenciais quebra de segurança e de vulnereabilidade), mas
    // na vida real, estariamos apresentando dados de um banco de dados
    // de uma API ou de algum arquivo do servidor mesmo.
    var props = {
      items: [
        'Item 0',
        'Item 1',
        'Item </script>',
        'Item <!--inject!-->',
      ]
    };

    // Aqui estamos usando metodos internos de renderização do React, utilizando
    // a função renderToStaticMarkup, mas poderia ser usado alguma linguagem de
    // template ou uma string mesmo para renderizar o html
    var html = React.renderToStaticMarkup(body(null,

      // É aqui que a renderização do lado do servidor ocorre, dessa forma
      // passamos as `props` para o html. Esta div é a mesma que será
      // utilizada no browser pelo browser.js
      div({id: 'content', dangerouslySetInnerHTML: {__html:
        React.renderToString(App(props))
      }}),

      // As propriedades devem ser sincronizadas entre o browser e o servidor 
      // então transformamos em string para que o código seja executado no browser.js
      // Você pode utilizar qualquer nome de variável, desde que seja única
      script({dangerouslySetInnerHTML: {__html:
        'var APP_PROPS = ' + safeStringify(props) + ';'
      }}),

      // Aqui carregamos o React direto do CDN - não é necessário fazer isso,
      // você pode deixa-lo fixo no lado do servidor direto no bundle
      script({src: '//fb.me/react-0.13.3.min.js'}),

      // Por fim o browser vai buscar o bundle do browserify contido
      // no browser.js juntamente com suas dependências.
      // Isso é definido pelo nosso outro endpoint mais abaixo.
      script({src: '/bundle.js'})
    ));

    // Retorna o html para a página
    res.end(html);

  // Este endpoint executa o bundle do browserify
  } else if (req.url == '/bundle.js') {

    res.setHeader('Content-Type', 'text/javascript')

    // Aqui utilizados browserify para empacotar para browser.js tudo que ele precisa.
    // Não utilize isso em produção, é um processo lento e desnecessário  
    // o correto é efetuar sua compilação antes ou utilizar algum middleware
    // como o browserify-middleware.
    // Utilizamos o literalify para a utilização global do React
    // para que seja utilizado direto pelo CDN carregado anteriormente
    // sem a necessidade de ser executado pelo bundle novamente
    browserify()
      .add('./browser.js')
      .transform(literalify.configure({react: 'window.React'}))
      .bundle()
      .pipe(res);

  // Retorna 404 para qualquer outro endpoint 
  } else {
    res.statusCode = 404;
    res.end();
  }

// Escutando na porta 3000
}).listen(3000, function(err) {
  if (err) throw err;
  console.log('Acesse http://localhost:3000 e veja a magia no ar');
})


// Uma função segura para fazer o parse JSON para utilizar tag <script>
function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
