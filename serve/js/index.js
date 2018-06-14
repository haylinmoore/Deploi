var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Card = function (_React$Component) {
  _inherits(Card, _React$Component);

  function Card(props) {
    _classCallCheck(this, Card);

    var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

    _this.state = {};

    _this.handleChange = _this.handleChange.bind(_this);

    _this.create = _this.create.bind(_this);

    _this.state.id = _this.props.id;

    var vars = JSON.parse(_this.props.vars);

    for (var i in vars) {
      _this.state[vars[i]] = "";
    }
    return _this;
  }

  _createClass(Card, [{
    key: "handleChange",
    value: function handleChange(text, e) {
      var change = this.state;
      change[text] = e.target.value;
      this.setState(change);
    }
  }, {
    key: "create",
    value: function create() {
      $.post("/api/create", { data: JSON.stringify(this.state) }).done(function (data) {
        alert("Data Loaded: " + data);
      });
    }
  }, {
    key: "input",
    value: function input(name) {
      return React.createElement(
        "div",
        { className: "input-field col s12" },
        React.createElement("input", {
          id: this.props.id + "_var_" + name,
          type: "text",
          className: "validate",
          onChange: this.handleChange.bind(this, name),
          placeholder: name.toUpperCase()
        })
      );
    }
  }, {
    key: "renderVars",
    value: function renderVars() {
      var returned = [];
      var temp = JSON.parse(this.props.vars);
      for (i in temp) {
        returned.push(this.input(temp[i]));
      }
      return returned;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "card col m6 s12 l4", style: { minHeight: "300px" } },
        React.createElement(
          "div",
          { className: "card-content" },
          React.createElement(
            "span",
            { className: "card-title activator grey-text text-darken-4" },
            this.props.title,
            React.createElement(
              "i",
              { className: "material-icons right" },
              "file_download"
            )
          ),
          React.createElement(
            "p",
            null,
            this.props.description
          )
        ),
        React.createElement(
          "div",
          { className: "card-reveal" },
          React.createElement(
            "span",
            { className: "card-title grey-text text-darken-4" },
            "Setup",
            React.createElement(
              "i",
              { className: "material-icons right" },
              "close"
            )
          ),
          React.createElement(
            "p",
            null,
            React.createElement(
              "div",
              { className: "input-field col   s12" },
              React.createElement("input", {
                id: this.props.id + "_name",
                type: "text",
                className: "validate",
                onChange: this.handleChange.bind(this, "name"),
                placeholder: "name"
              })
            ),
            this.renderVars(),
            React.createElement("br", null),
            React.createElement(
              "button",
              {
                onClick: this.create,
                className: "waves-effect waves-light btn"
              },
              React.createElement(
                "i",
                { className: "material-icons left" },
                "cloud"
              ),
              "Deploy"
            )
          )
        )
      );
    }
  }]);

  return Card;
}(React.Component);

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: "renderCards",
    value: function renderCards() {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "/api/apps.json", false);
      xhttp.send();
      var apps = JSON.parse(xhttp.responseText);

      var response = [];

      for (var i in apps) {
        response.push(React.createElement(Card, {
          id: i,
          title: apps[i].name,
          description: apps[i].description,
          vars: JSON.stringify(apps[i].vars)
        }));
      }

      return React.createElement(
        "div",
        null,
        response
      );
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.renderCards()
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("app"));