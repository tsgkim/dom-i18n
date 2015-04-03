describe('dom-i18n', function() {

  'use strict';

  var createdIds = [];
  var forEach = Array.prototype.forEach;
  var createElement = window.document.createElement.bind(window.document);
  var getElementById = window.document.getElementById.bind(window.document);

  beforeEach(function () {

    var rootElem = window.document.body;

    // makes sure default language is always the same for tests purposes
    window.navigator.language = 'en-US';

    function createTextNode(id, text) {
      var childElem = createElement('span');
      childElem.id = id;
      childElem.textContent = text;
      childElem.dataset.translatable = true;
      createdIds.push(id);
      return childElem;
    }

    (function createDefaultTest() {
      rootElem.appendChild(
        createTextNode(
          'hello-world',
          'Hello world // Bonjour Montréal // Mundão velho sem porteira'
        )
      );
    })();

    (function createAttributeTest() {

      var childElem = createElement('img');
      childElem.id = 'attr-test';
      childElem.dataset.translatable = true;
      childElem.dataset.translatableAttr = 'title';
      childElem.title = 'Hello world // Bonjour Montréal // Mundão velho sem porteira';
      rootElem.appendChild(childElem);

      createdIds.push(childElem.id);
    })();

  });

  afterEach(function () {

    createdIds.forEach(function (id, index) {

      var elem = getElementById(id);
      var parent = elem.parentNode;

      parent.removeChild(elem);
    });

    createdIds = [];

  });

  it('should get default language using default parameters', function() {

    window.domI18n();

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Hello world');

  });

  it('should get second language listed on default example', function() {

    window.domI18n({
      languages: ['en', 'fr-ca', 'pt-br'],
      currentLanguage: 'fr-ca'
    });

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Bonjour Montréal');

  });

  it('should use a simpler lang ref in case language is not found', function() {

    window.domI18n({
      languages: ['en', 'fr', 'pt'],
      currentLanguage: 'pt-br'
    });

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Mundão velho sem porteira');

  });

  it('should use default language if provided ref is not found', function() {

    window.domI18n({
      languages: ['en', 'fr', 'pt'],
      defaultLanguage: 'fr',
      currentLanguage: 'es'
    });

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Bonjour Montréal');

  });

  it('should also work for specified attributes', function() {

    window.domI18n({
      languages: ['en', 'fr', 'pt'],
      defaultLanguage: 'en',
      currentLanguage: 'pt'
    });

    expect(
      getElementById('attr-test').title
    ).toEqual('Mundão velho sem porteira');

  });

  it('should be able to change languages', function() {

    var i18n = window.domI18n({
      languages: ['en', 'fr-ca', 'pt-br'],
      currentLanguage: 'en'
    });

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Hello world');

    i18n.changeLanguage('fr-ca');

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Bonjour Montréal');

  });

  it('should be able to switch languages back and forth', function() {

    var i18n = window.domI18n({
      languages: ['en', 'fr-ca', 'pt-br'],
      currentLanguage: 'en'
    });

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Hello world');

    i18n.changeLanguage('fr-ca');

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Bonjour Montréal');

    i18n.changeLanguage('en');

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Hello world');

    i18n.changeLanguage('pt-br');

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Mundão velho sem porteira');

    i18n.changeLanguage('fr-ca');

    expect(
      getElementById('hello-world').textContent
    ).toEqual('Bonjour Montréal');

  });

});

