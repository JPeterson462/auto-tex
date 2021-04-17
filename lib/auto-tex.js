'use babel';

import AutoTexView from './auto-tex-view';
import { CompositeDisposable } from 'atom';

var exec = require('child_process').exec, child;

export default {

  autoTexView: null,
  subscriptions: null,

  activate(state) {
    this.autoTexView = new AutoTexView(state.autoTexViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'auto-tex:generate': () => this.generate()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'auto-tex:finalize': () => this.finalize()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.autoTexView.destroy();
  },

  serialize() {
    return {
      autoTexViewState: this.autoTexView.serialize()
    };
  },

  generate() {
    console.log('Generating PDF...');
    var texteditor = atom.workspace.getActiveTextEditor();
    if (texteditor) {
      var texfilepath = texteditor.getPath();
      var directory = texfilepath.substring(0, texfilepath.lastIndexOf('/'));
      var filename = texfilepath.substring(texfilepath.lastIndexOf('/') + 1);
      if (directory && filename) {
        const { exec } = require('child_process');

        const xelatex = exec(`cd "${directory}" && xelatex ${filename} && xelatex ${filename}`);
        // run xelatex twice to recompute page numbers

        xelatex.stdout.on('data', (data) => {
            // ignore the output unless debugging
        });
      }
    }
  },

  finalize() {
    console.log('Finalizing PDF...');
    var texteditor = atom.workspace.getActiveTextEditor();
    if (texteditor) {
      var texfilepath = texteditor.getPath();
      var directory = texfilepath.substring(0, texfilepath.lastIndexOf('/'));
      var finaldirectory = directory.replace('Draft', 'Final');
      var filename = texfilepath.substring(texfilepath.lastIndexOf('/') + 1);
      var filenamepdf = filename.replace(".tex", ".pdf");
      var finalfilename = filename.replace("_draft", "").replace(".tex", ".pdf");
      if (directory && filename) {
        const { exec } = require('child_process');

        var cmd = `cd "${directory}" && xelatex ${filename} && xelatex ${filename} && cp "${directory}/${filenamepdf}" "${finaldirectory}/${finalfilename}"`;
        console.log(cmd);

        const xelatex = exec(cmd);
        // run xelatex twice to recompute page numbers

        xelatex.stdout.on('data', (data) => {
            // ignore the output unless debugging
            console.log(data);
        });
      }
    }
  }

};
