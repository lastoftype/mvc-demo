jQuery(document).ready(function($) {

  /**
   * Books Model
   *
   * @return {Object} object
   */
  var Books = function() {
    this.data = bookshelf_books;
  };

  var ViewModel = function() {
    this.view = 1;
  };

  var viewModel = new ViewModel();

  /**
   * getKeyByValue returns an object of the ailment
   * based on a value (a rescurisive search)
   *
   * @param {String} value
   * @return {Object} object
   */
  Books.prototype.getKeyByValue = function(value) {
    var data = this.data;
    var lookup = {};
    for (var i = 0, len = data.length; i < len; i++) {
      lookup[data[i].titleweb] = data[i];
    }
    return lookup[value];
  };

  /**
   * getBooksByTag returns all books with tag
   *
   * @param {String} tag
   * @return {Object} object
   */
  Books.prototype.getBooksByTag = function(value) {
    var data = this.data;

    // Use jQuery .grep function to filter through array
    var returnedData = $.grep(data, function(element, index) {
      var tags = element.tags;
      var inarray = $.inArray(value, tags);

      // If it's in the array, add it to returnedData
      if (inarray > -1) {
        return true;
      }
    });
    returnedData.count = returnedData.length;
    returnedData.tag = value;
    return returnedData;
  };

  /**
   * Collection model: Creates object based on tag
   *
   * @param {String} tag
   * @return {Object} object
   */
  var Collection = function(tag) {
    this.tag = tag;
  };

  /**
   * function getThreeBooks: grabs 3 books (only) based on the tag input
   *
   * @param {String} tag
   * @return {Object} object
   */
  Collection.prototype.getThreeBooks = function(tag) {

    var books = new Books();
    var booksInTag = books.getBooksByTag(tag);

    // Use shuffle function to randomize order
    var shuffled = Shuffle(booksInTag);

    // Set up array
    var bookArray = [];
    for (var i = 0; i <= 2; i++) {

      // Add to array
      bookArray.push(booksInTag[i]);
    };

    bookArray.push({
      'tag': tag
    });
    // Return array of 3 books
    console.log(bookArray);
    return bookArray;

  };

  /**
   * Ailment model: Creates object and grabs from mainAilments object in ailments.js
   *
   * @return {Object} object
   */
  var Ailments = function() {
    // Store data
    this.data = mainAilments.items;
  };

  /**
   * function getAilments: gets all main ailments (total of 5)
   *
   * @return {Array} ailmentArray
   */
  Ailments.prototype.getAilments = function() {
    var ailmentArray = [];
    $.each(this.data, function(index, val) {
      ailmentArray.push(val.ailment);
    });
    return ailmentArray;
  };

  /**
   * function getKeyByValue: get ailment object from value input
   *
   * @return {Object} ailmentArray
   */
  Ailments.prototype.getKeyByValue = function(value) {
    var data = this.data;
    var object = {};
    for (var i = 0, len = data.length; i < len; i++) {
      object[data[i].ailment] = data[i];
    }

    // Returns ailment object based on value
    return object[value];
  };

  /**
   * function getSubAilments: get ailment object from value input
   *
   * @return {Object} ailmentArray
   */
  Ailments.prototype.getSubAilments = function(value) {
    var data = this.data;
    var object = {};
    for (var i = 0, len = data.length; i < len; i++) {
      object[data[i].ailment] = data[i];
    }
    return object[value].subailments;
  };

  /**
   * Ailment controller
   * 
   * Good place to refactor
   */
  var AilmentController = Spine.Controller.sub({
    elements: {
      ".item": "item"
    },
    events: {
      "click .ba-logo": "renderAilments",
      "click [data-view='1']": "renderSubailments",
      "click [data-view='2']": "renderPrescription",
      "click .ba-twitter": "shareTwitter",
      "click .ba-facebook": "shareFacebook",
    },
    init: function(event) {

      // Create view from main ailments
      var view = new AilmentView(mainAilments.items);

      // Set to first view
      viewModel.view = 1;

      // Render it
      view.output();
      
    },
    renderAilments: function(event) {

      if (!event) {
        event = window.event;
      }

      // Prevent click from moving user
      event.preventDefault();

      // Create view from main ailments
      var view = new AilmentView(mainAilments.items);

      // Set to first view
      viewModel.view = 1;

      // Render it
      view.output();

    },
    renderSubailments: function(event) {

      if (!event) {
        event = window.event;
      }

      // Prevent click from moving user
      event.preventDefault();

      // Get name of ailment
      var name = $(event.target).text();

      // Set up object
      var ailments = new Ailments();

      // Get sub ailments from main ailment
      var subailments = ailments.getKeyByValue(name);

      $('.list-ailments li').addClass('animated fadeOut');

      setTimeout(function() {

        // Activate View
        var view = new AilmentView(subailments);

        // Set view to 2nd
        viewModel.view = 2;
        view.output();

      }, 500);

    },
    renderPrescription: function(event) {

      if (!event) {
        event = window.event;
      }

      // Prevent click from moving user
      event.preventDefault();

      // Get name of subailment
      var tag = $(event.target).text();

      // Set up object
      var collection = new Collection(tag);
      var threeBooks = collection.getThreeBooks(tag);

      // Set up loading view
      var loading = new AilmentView();

      // Fade out sub ailments
      $('.list-ailments li').addClass('animated fadeOut');

      // Wait and then load screen
      setTimeout(function() {
        viewModel.view = 'loading';
        loading.output();
      }, 500);

      // Then load prescriptions
      setTimeout(function() {
        viewModel.view = 3;
        var view = new AilmentView(threeBooks);
        view.output();
      }, 2600);
    }
  });

  /**
   * Ailment view
   */
  var AilmentView = function(model) {
    this.model = model;
    return this;
  };

  /**
   * function output: output view based on viewNumber
   *
   * @return {Object} ailmentArray
   */

  // View - Output function
  AilmentView.prototype.output = function() {
    this.view = viewModel.view;
    this.dir = './app/assets/mustache/';
    this.file = this.view + '.mst';
    this.path = this.dir + this.file;
    var path = this.path;
    var model = this.model;
    // Mustache code
    $.get(path, function(template) {
      var rendered = Mustache.render(template, model);
      $('#target').html(rendered);
    });

  };


  // Set up app and scope
  var app = new AilmentController({
    el: $(".target-wrapper")
  });

  // Get the party started
  app.init();

});
