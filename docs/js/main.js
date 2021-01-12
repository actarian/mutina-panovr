/**
 * @license mutina-panovr v1.0.0
 * (c) 2021 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(require('rxcomp'),require('rxjs/operators'),require('rxjs')):typeof define==='function'&&define.amd?define(['rxcomp','rxjs/operators','rxjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.rxcomp,g.rxjs.operators,g.rxjs));}(this,(function(rxcomp, operators, rxjs){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.remove('hidden');
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var IntersectionService = /*#__PURE__*/function () {
  function IntersectionService() {}

  IntersectionService.observer = function observer() {
    var _this = this;

    if (!this.observer_) {
      this.readySubject_ = new rxjs.BehaviorSubject(false);
      this.observerSubject_ = new rxjs.Subject();
      this.observer_ = new IntersectionObserver(function (entries) {
        _this.observerSubject_.next(entries);
      });
    }

    return this.observer_;
  };

  IntersectionService.intersection$ = function intersection$(node) {
    if ('IntersectionObserver' in window) {
      var observer = this.observer();
      observer.observe(node);
      return this.observerSubject_.pipe( // tap(entries => console.log(entries.length)),
      operators.map(function (entries) {
        return entries.find(function (entry) {
          return entry.target === node;
        });
      }), operators.filter(function (entry) {
        return entry !== undefined;
      }), // tap(entry => console.log('IntersectionService.intersection$', entry)),
      operators.finalize(function () {
        return observer.unobserve(node);
      }));
    } else {
      return rxjs.of({
        target: node,
        isIntersecting: true
      });
    }
  };

  IntersectionService.firstIntersection$ = function firstIntersection$(node) {
    return this.intersection$(node).pipe(operators.filter(function (entry) {
      return entry.isIntersecting;
    }), // entry.intersectionRatio > 0
    operators.first());
  };

  return IntersectionService;
}();var AppearStaggerDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(AppearStaggerDirective, _Directive);

  function AppearStaggerDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = AppearStaggerDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('appear-stagger');
  };

  _proto.onChanges = function onChanges() {
    if (!this.appeared) {
      this.appeared = true;

      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      IntersectionService.firstIntersection$(node).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (src) {
        node.classList.add('appeared');
      });
    }
  };

  return AppearStaggerDirective;
}(rxcomp.Directive);
AppearStaggerDirective.meta = {
  selector: '[appear-stagger]'
};var AppearDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(AppearDirective, _Directive);

  function AppearDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = AppearDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('appear');
  };

  _proto.onChanges = function onChanges() {
    if (!this.appeared) {
      this.appeared = true;

      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      IntersectionService.firstIntersection$(node).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (src) {
        node.classList.add('appeared');
      });
    }
  };

  return AppearDirective;
}(rxcomp.Directive);
AppearDirective.meta = {
  // selector: '[appear],.row,.listing--series,.listing--products,.listing--cards,.listing--news,.listing--downloads',
  selector: '.picture'
};var ClickOutsideDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ClickOutsideDirective, _Directive);

  function ClickOutsideDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ClickOutsideDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.initialFocus = false;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node,
        parentInstance = _getContext.parentInstance,
        selector = _getContext.selector;

    var event$ = this.event$ = rxjs.fromEvent(document, 'click').pipe(operators.filter(function (event) {
      var target = event.target; // console.log('ClickOutsideDirective.onClick', this.element.nativeElement, target, this.element.nativeElement.contains(target));
      // const documentContained: boolean = Boolean(document.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINED_BY);
      // console.log(target, documentContained);

      var clickedInside = node.contains(target) || !document.contains(target);

      if (!clickedInside) {
        if (_this.initialFocus) {
          _this.initialFocus = false;
          return true;
        }
      } else {
        _this.initialFocus = true;
      }
    }), operators.shareReplay(1));
    var expression = node.getAttribute("(clickOutside)");

    if (expression) {
      var outputFunction = module.makeFunction(expression, ['$event']);
      event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        module.resolve(outputFunction, parentInstance, event);
      });
    } else {
      parentInstance.clickOutside$ = event$;
    }
  };

  return ClickOutsideDirective;
}(rxcomp.Directive);
ClickOutsideDirective.meta = {
  selector: "[(clickOutside)]"
};/*
['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
['"', '&', ''', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
*/

var HtmlPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(HtmlPipe, _Pipe);

  function HtmlPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  HtmlPipe.transform = function transform(value) {
    if (value) {
      value = value.replace(/&#(\d+);/g, function (m, n) {
        return String.fromCharCode(parseInt(n));
      });
      var escapes = ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
      var unescapes = ['"', '&', '\'', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
      var rx = new RegExp("(&" + escapes.join(';)|(&') + ";)", 'g');
      value = value.replace(rx, function () {
        for (var i = 1; i < arguments.length; i++) {
          if (arguments[i]) {
            // console.log(arguments[i], unescapes[i - 1]);
            return unescapes[i - 1];
          }
        }
      }); // console.log(value);

      return value;
    }
  };

  return HtmlPipe;
}(rxcomp.Pipe);
HtmlPipe.meta = {
  name: 'html'
};var ModalEvent = function ModalEvent(data) {
  this.data = data;
};
var ModalResolveEvent = /*#__PURE__*/function (_ModalEvent) {
  _inheritsLoose(ModalResolveEvent, _ModalEvent);

  function ModalResolveEvent() {
    return _ModalEvent.apply(this, arguments) || this;
  }

  return ModalResolveEvent;
}(ModalEvent);
var ModalRejectEvent = /*#__PURE__*/function (_ModalEvent2) {
  _inheritsLoose(ModalRejectEvent, _ModalEvent2);

  function ModalRejectEvent() {
    return _ModalEvent2.apply(this, arguments) || this;
  }

  return ModalRejectEvent;
}(ModalEvent);

var ModalService = /*#__PURE__*/function () {
  function ModalService() {}

  ModalService.open$ = function open$(modal) {
    var _this = this;

    return this.getTemplate$(modal.src).pipe(operators.map(function (template) {
      return {
        node: _this.getNode(template),
        data: modal.data,
        modal: modal
      };
    }), operators.tap(function (node) {
      return _this.modal$.next(node);
    }), operators.switchMap(function (node) {
      return _this.events$;
    }));
  };

  ModalService.load$ = function load$(modal) {};

  ModalService.getTemplate$ = function getTemplate$(url) {
    return rxjs.from(fetch(url).then(function (response) {
      return response.text();
    }));
  };

  ModalService.getNode = function getNode(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    var node = div.firstElementChild;
    return node;
  };

  ModalService.reject = function reject(data) {
    this.modal$.next(null);
    this.events$.next(new ModalRejectEvent(data));
  };

  ModalService.resolve = function resolve(data) {
    this.modal$.next(null);
    this.events$.next(new ModalResolveEvent(data));
  };

  return ModalService;
}();
ModalService.modal$ = new rxjs.Subject();
ModalService.events$ = new rxjs.Subject();var ModalOutletComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ModalOutletComponent, _Component);

  function ModalOutletComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ModalOutletComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.modalNode = node.querySelector('.modal-outlet__modal');
    ModalService.modal$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (modal) {
      _this.modal = modal;
    });
  };

  _proto.onRegister = function onRegister(event) {
    // console.log('ModalComponent.onRegister');
    this.pushChanges();
  };

  _proto.onLogin = function onLogin(event) {
    // console.log('ModalComponent.onLogin');
    this.pushChanges();
  };

  _proto.reject = function reject(event) {
    ModalService.reject();
  };

  _createClass(ModalOutletComponent, [{
    key: "modal",
    get: function get() {
      return this.modal_;
    },
    set: function set(modal) {
      // console.log('ModalOutletComponent set modal', modal, this);
      var _getContext2 = rxcomp.getContext(this),
          module = _getContext2.module;

      if (this.modal_ && this.modal_.node) {
        module.remove(this.modal_.node, this);
        this.modalNode.removeChild(this.modal_.node);
      }

      if (modal && modal.node) {
        this.modal_ = modal;
        this.modalNode.appendChild(modal.node);
        var instances = module.compile(modal.node);
      }

      this.modal_ = modal;
      this.pushChanges();
    }
  }]);

  return ModalOutletComponent;
}(rxcomp.Component);
ModalOutletComponent.meta = {
  selector: '[modal-outlet]',
  template:
  /* html */
  "\n\t<div class=\"modal-outlet__container\" [class]=\"{ active: modal }\">\n\t\t<div class=\"modal-outlet__background\" (click)=\"reject($event)\"></div>\n\t\t<div class=\"modal-outlet__modal\"></div>\n\t</div>\n\t"
};var ModalComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ModalComponent, _Component);

  function ModalComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ModalComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        parentInstance = _getContext.parentInstance;

    if (parentInstance instanceof ModalOutletComponent) {
      this.data = parentInstance.modal.data;
    }
  };

  _proto.close = function close() {
    ModalService.reject();
  };

  return ModalComponent;
}(rxcomp.Component);
ModalComponent.meta = {
  selector: '[modal]'
};var PANO_UID = 0;
var listeners = {};

var PanoVRComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(PanoVRComponent, _Component);

  function PanoVRComponent() {
    return _Component.apply(this, arguments) || this;
  }

  PanoVRComponent.onClickedPin = function onClickedPin(clickedUid, clickedIndex) {
    // console.log('PanoVRComponent.onClickedPin', clickedUid, clickedIndex);
    Object.keys(listeners).forEach(function (uid) {
      if (clickedUid === parseInt(uid)) {
        var instance = listeners[uid];
        instance.onClickedPin.call(instance, clickedIndex);
      }
    });
  };

  PanoVRComponent.register = function register(uid, instance) {
    listeners[uid] = instance;
  };

  PanoVRComponent.unregister = function unregister(uid) {
    delete listeners[uid];
  };

  var _proto = PanoVRComponent.prototype;

  _proto.getNode = function getNode() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    return node;
  };

  _proto.onInit = function onInit() {
    var _this = this;

    var uid = this.uid = ++PANO_UID;
    PanoVRComponent.register(uid, this);
    this.items = [];
    this.item = null;
    this.load$().pipe(operators.first()).subscribe(function (items) {
      _this.items = items;

      _this.loadPanoVr();
    });
  };

  _proto.onDestroy = function onDestroy() {
    PanoVRComponent.unregister(uid);
  };

  _proto.load$ = function load$() {
    return rxjs.of([{
      id: 1,
      title: 'End Piece L',
      abstract: 'Black painted metal on dark oak',
      image: '/mutina-panovr/img/panovr/end-piece-l.jpg',
      link: {
        url: '#',
        title: 'Accents Wood Collection'
      }
    }, {
      id: 2,
      title: 'End Piece L 2',
      abstract: 'Black painted metal on dark oak',
      image: '/mutina-panovr/img/panovr/end-piece-l.jpg',
      link: {
        url: '#',
        title: 'Accents Wood Collection'
      }
    }, {
      id: 3,
      title: 'End Piece L 3',
      abstract: 'Black painted metal on dark oak',
      image: '/mutina-panovr/img/panovr/end-piece-l.jpg',
      link: {
        url: '#',
        title: 'Accents Wood Collection'
      }
    }]);
  };

  _proto.loadPanoVr = function loadPanoVr() {
    var _this2 = this;

    var node = this.getNode();
    var name = "panovr-" + this.uid;
    var inner = node.querySelector('.panovr__inner');
    inner.setAttribute('id', name);
    console.log(inner); // window.onClickedPin = this.onClickedPin.bind(this);
    // create the panorama player with the container

    var pano = this.pano = new pano2vrPlayer(name); // add the skin object

    var skin = new pano2vrSkin(pano); // load the configuration

    pano.setBasePath(this.getBasePath(this.panovr));
    this.loadPanoVR(this.panovr, function (xmlString) {
      _this2.parsePanoVRString(xmlString);
    });
    /*
    this.loadPanoVRXML(this.panovr, (xml) => {
    	this.parsePanoVRXML(xml);
    });
    */

    /*
    this.readPanoVRXML(this.panovr);
    */
  };

  _proto.getBasePath = function getBasePath(url) {
    // http://127.0.0.1:42345/mutina-panovr/panovr/exampletiles/node4/cf_0/l_1/c_1/tile_0.jpg
    var segments = url.split('/');
    segments.pop();
    return segments.join('/') + '/';
  };

  _proto.loadPanoVR = function loadPanoVR(url, callback) {
    function onLoad() {
      // console.log(this.responseText);
      if (typeof callback === 'function') {
        callback(this.responseText);
      }
    }

    var request = new XMLHttpRequest();
    request.onload = onLoad;
    request.open('GET', url);
    request.send();
  };

  _proto.parsePanoVRString = function parsePanoVRString(xmlString) {
    xmlString = xmlString.replace(/javascript\:onClickedPin\(/g, "javascript:onClickedPin(" + this.uid + ","); // console.log('xmlString', xmlString);

    var pano = this.pano; // .then(data => console.log('panovr', data));

    pano.readConfigString(xmlString); // pano.readConfigUrl(this.panovr);

    this.initPanoVR();
  };

  _proto.loadPanoVRXML = function loadPanoVRXML(url, callback) {
    function onLoad() {
      // console.log(this.responseXML);
      if (typeof callback === 'function') {
        callback(this.responseXML);
      }
    }

    var request = new XMLHttpRequest();
    request.onload = onLoad;
    request.open('GET', url);
    request.send();
    /*
    fetch(this.panovr)
    .then(response => response.text())
    .then(text => (new window.DOMParser()).parseFromString(text, 'text/xml'))
    .then(xml => {
    	this.parsePanoVRXML(xml);
    });
    */
  };

  _proto.parsePanoVRXML = function parsePanoVRXML(xml) {
    var pano = this.pano; // .then(data => console.log('panovr', data));

    pano.readConfigXml(xml); // pano.readConfigUrl(this.panovr);

    this.initPanoVR();
  };

  _proto.readPanoVRXML = function readPanoVRXML(url) {
    var pano = this.pano;
    pano.readConfigUrl(url);
    this.initPanoVR();
  };

  _proto.initPanoVR = function initPanoVR() {
    var _this3 = this;

    var pano = this.pano;
    var nodes = pano.getNodeIds(); // console.log('getNodeIds', nodes);
    // console.log('getNodeUserdata', pano.getNodeUserdata(nodes[0]));
    // console.log('getNodeLatLng', pano.getNodeLatLng(nodes[0]));
    // console.log('getPointHotspotIds', pano.getPointHotspotIds());
    // console.log('getCurrentPointHotspots', pano.getCurrentPointHotspots());

    pano.getPointHotspotIds().forEach(function (id) {
      var hotSpot = pano.getHotspot(id); // console.log('hotSpot', hotSpot);

      if (hotSpot.url.indexOf('onClickedPin') !== -1) {
        hotSpot.url = "javascript:alert('pippo');"; // console.log('url', hotSpot.url);

        /*
        hotSpot.div.onClick = function() {
        	console.log('hello');
        }
        */

        /*
        pano.addHotspot(id,hotSpot.pan,hotSpot.tilt,hotSpot.div);
        */
      }
    });
    /*
    pano.on('sizechanged', (event) => {
    	console.log('sizechanged', event);
    });
    */

    pano.on('repaint', function (event) {
      _this3.onRepaint(event);
    });
    this.onClickOutside = this.onClickOutside.bind(this);
    document.addEventListener('click', this.onClickOutside); // this.addHotSpot(pano, 0, 0);
    // this.addHotSpot(pano, 0, -30);
    // this.addHotSpot(pano, -70, 0);
  }
  /*
  addHotSpot(pano, x, y) {
  	const hotspot = document.createElement('div');
  	hotspot.classList.add('hotspot');
  	hotspot.addEventListener('click', (e) => {
  		console.log(this, e);
  	});
  	pano.addHotspot(`hotspot-${++PANO_UID}`, x, y, hotspot);
  }
  */
  ;

  _proto.onClickOutside = function onClickOutside(event) {
    // console.log('onClickOutside', event.target);
    var node = this.getNode();
    var toast = node.querySelector('.panovr-toast');

    if (!PanoVRComponent.isChildOfNode(event.target, toast)) {
      this.index = null;
      this.item = null;
      this.removeToast();
      this.pushChanges();
    }
  };

  PanoVRComponent.isChildOfNode = function isChildOfNode(child, node) {
    if (!child || !node) {
      return false;
    }

    if (child === node) {
      return true;
    } else if (child.parentNode) {
      return this.isChildOfNode(child.parentNode, node);
    } else {
      return false;
    }
  };

  _proto.onClickedPin = function onClickedPin(index) {
    // console.log('onClickedPin', index);
    this.index = index;
    this.item = this.items[index];
    this.addToast(this.item); // this.pushChanges();

    this.pin.next(index);
    this.onRepaint();
  };

  _proto.addToast = function addToast(item) {
    this.removeToast();
    var template =
    /* html */
    "\n\t\t<div class=\"panovr-toast\">\n\t\t\t<div class=\"panovr-toast__content\">\n\t\t\t\t<div class=\"panovr-toast__title\">" + item.title + "</div>\n\t\t\t\t<div class=\"panovr-toast__abstract\">" + item.abstract + "</div>\n\t\t\t\t<div class=\"panovr-toast__group-cta\">\n\t\t\t\t\t<a class=\"panovr-toast__cta\" href=\"" + item.link.url + "\">" + item.link.title + "</a>\n\t\t\t\t\t<a class=\"panovr-toast__cta\">Add to samples</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"panovr-toast__picture\">\n\t\t\t\t<img src=\"" + item.image + "\" />\n\t\t\t</div>\n\t\t\t<!-- <div class=\"panovr-toast__close\" (click)=\"onToastClose($event)\">x</div> -->\n\t\t</div>\n\t\t";
    var node = this.getNode();
    var temp = document.createElement('div');
    temp.innerHTML = template;
    node.appendChild(temp.firstElementChild);
  };

  _proto.removeToast = function removeToast() {
    var node = this.getNode();
    var toast = node.querySelector('.panovr-toast');

    if (toast) {
      toast.parentElement.removeChild(toast);
    }
  };

  _proto.onRepaint = function onRepaint() {
    var _this4 = this;

    var index = this.index;

    if (index != null) {
      var node = this.getNode();
      var toast = node.querySelector('.panovr-toast');

      if (toast) {
        var pano = this.pano;
        var hotSpot = pano.getPointHotspotIds().map(function (id) {
          return pano.getHotspot(id);
        }).find(function (hotSpot) {
          return hotSpot.url === "javascript:onClickedPin(" + _this4.uid + "," + index + ");";
        });
        var x = 0;
        var y = 0;

        if (hotSpot) {
          var nodeRect = node.getBoundingClientRect();
          var hotSpotDiv = hotSpot.div;
          var rect = hotSpotDiv.getBoundingClientRect(); // console.log(rect, hotSpot, hotSpotDiv);

          x = rect.x - nodeRect.x;
          y = rect.y - nodeRect.y;
          var dx = x / nodeRect.width;
          var dy = y / nodeRect.height;
          var ax = Math.floor(dx * 3) - 1;
          var ay = Math.floor(dy * 3) - 1;
          toast.classList.remove('left', 'right', 'top', 'bottom');
          /*
          toast.classList.remove('left', 'center', 'right', 'top', 'middle', 'bottom');
          toast.classList.add(['left', 'center', 'right'][ax]);
          toast.classList.add(['top', 'middle', 'bottom'][ay]);
          */

          var tx = x;
          var ty = y;
          var tw = toast.offsetWidth;
          var th = toast.offsetHeight;
          var gx = 30;
          var gy = 30;

          if (ax < 0) {
            // left
            if (ay < 0) {
              // top
              tx = x + gx;
              ty = y + gy;
            } else if (ay === 0) {
              // middle
              tx = x + gx;
              ty = y - th / 2;
              toast.classList.add('left');
            } else if (ay > 0) {
              // bottom
              tx = x + gx;
              ty = y - gy - th;
            }
          } else if (ax === 0) {
            // center
            if (ay < 0) {
              // top
              tx = x - tw / 2;
              ty = y + gy;
              toast.classList.add('top');
            } else if (ay === 0) {
              // middle
              tx = x - tw / 2;
              ty = y + gy;
              toast.classList.add('top');
            } else if (ay > 0) {
              // bottom
              tx = x - tw / 2;
              ty = y - gy - th;
              toast.classList.add('bottom');
            }
          } else if (ax > 0) {
            // right
            if (ay < 0) {
              // top
              tx = x - gx - tw;
              ty = y + gy;
            } else if (ay === 0) {
              // middle
              tx = x - gx - tw;
              ty = y - th / 2;
              toast.classList.add('right');
            } else if (ay > 0) {
              // bottom
              tx = x - gx - tw;
              ty = y - gy - th;
            }
          } // console.log(ax, ay, tx, ty, tw, th);


          toast.style.position = 'absolute';
          toast.style.left = tx + "px";
          toast.style.top = ty + "px"; // [style]="{ position: 'absolute', left: x + 'px', top: y + 'px' }"
        }
      }
    }
  };

  _proto.onToastClose = function onToastClose(event) {
    // console.log('onToastClose');
    this.item = null;
    this.pushChanges();
  };

  return PanoVRComponent;
}(rxcomp.Component);
PanoVRComponent.meta = {
  selector: '[panovr]',
  outputs: ['pin'],
  inputs: ['panovr']
};
window.onClickedPin = PanoVRComponent.onClickedPin;var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule],
  declarations: [AppearDirective, AppearStaggerDirective, ClickOutsideDirective, HtmlPipe, ModalComponent, ModalOutletComponent, PanoVRComponent],
  bootstrap: AppComponent
};rxcomp.Browser.bootstrap(AppModule);})));