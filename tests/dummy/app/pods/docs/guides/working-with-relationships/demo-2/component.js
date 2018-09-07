import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  store: service(),

  didInsertElement() {
    this._super(...arguments);

    this.get('loadPost').perform();
    this.setup();
  },

  loadPost: task(function*() {
    return yield this.get('store').findRecord('post', 2);
  }),

  post: readOnly('loadPost.lastSuccessful.value'),

  setup() {
    let tasks = {
      // BEGIN-SNIPPET working-with-relationships-demo-2.js
      reloadWithComments: task(function*() {
        yield this.get('post').reloadWith('comments');
      })
      // END-SNIPPET
    };

    this.get('store').resetCache();
    // We do this to reset loadComments state
    this.set('reloadWithComments', tasks.reloadWithComments);
  },

  actions: {
    reset() {
      this.setup();
    }
  }


});
