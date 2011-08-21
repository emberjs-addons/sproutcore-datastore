// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require("sproutcore-views/views/collection_view");
require("sproutcore-handlebars/main");

var set = SC.set, get = SC.get;

module("collections", {
  setup: function() {
    window.Tests = SC.Namespace.create({
      store: SC.Store.create().from("SC.FixturesDataSource")
    });

    Tests.Comment = SC.Record.extend({
      body: SC.Record.attr(String),
      post: SC.Record.toOne("Tests.Post", {
        inverse: 'comments',
        isMaster: YES
      })
    });

    Tests.Post = SC.Record.extend({
      title: SC.Record.attr(String),
      body: SC.Record.attr(String),
      comments: SC.Record.toMany("Tests.Comment", {
        inverse: 'post',
        isMaster: NO
      })
    });

    Tests.Post.FIXTURES = [
      { guid: 1, title: "First post", comments: [1, 2] }
    ];

    Tests.Comment.FIXTURES = [
      { guid: 1,
        body: "First",
        post: 1
      },
      { guid: 2,
        body: "Second",
        post: 1
      }
    ];

    SC.run.begin();

  },
  teardown: function() {
    window.Tests = undefined;
    SC.run.end();
  }
});

test("properly adds and removes nodes with SC.ManyArray", function() {
  var post = Tests.store.find(Tests.Post).objectAt(0);

  Tests.commentsController = SC.ArrayProxy.create({
    content: post.get("comments")
  });

  Tests.commentsListView = SC.CollectionView.extend({
    contentBinding: "Tests.commentsController.content"
  });

  var view = SC.View.create({
    template: SC.Handlebars.compile(
      "{{#collection Tests.commentsListView}}" +
        "{{content.body}}" +
      "{{/collection}}"
    )
  });

  SC.run(function() {
    view.appendTo('#qunit-fixture');
  });

  equals(view.$().text(), 'FirstSecond');

  var comment;
  SC.run(function() {
    var attrs = { guid: 3, body: "Third", post: 1 };
    comment = Tests.store.createRecord(Tests.Comment, attrs);

    post.get("comments").addInverseRecord(comment);
    // TODO: I can't make it work without calling rerender, but
    // it works properly in application, so I'm leaving it like
    // this for now
    view.rerender();
  });

  SC.run(function() {
    post.get("comments").removeInverseRecord(comment);
    view.rerender();
  });

  equals(view.$().text(), 'FirstSecond');
});

test("properly adds and removes nodes with SC.RecordArray", function() {
  var comments = Tests.store.find(Tests.Comment);

  Tests.commentsController = SC.ArrayProxy.create({
    content: comments
  });

  Tests.commentsListView = SC.CollectionView.extend({
    contentBinding: "Tests.commentsController.content"
  });

  var view = SC.View.create({
    template: SC.Handlebars.compile(
      "{{#collection Tests.commentsListView}}" +
        "{{content.body}}" +
      "{{/collection}}"
    )
  });

  SC.run(function() {
    view.appendTo('#qunit-fixture');
  });

  equals(view.$().text(), 'FirstSecond');

  var comment;
  SC.run(function() {
    var attrs = { guid: 3, body: "Third", post: 1 };
    comment = Tests.store.createRecord(Tests.Comment, attrs);
    view.rerender();
  });

  equals(view.$().text(), 'ThirdFirstSecond');

  SC.run(function() {
    comment.destroy();
    view.rerender();
  });

  equals(view.$().text(), 'FirstSecond');
});

