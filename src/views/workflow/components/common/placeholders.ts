/*计算公式:表单变量装饰器*/
import {
  Decoration,
  DecorationSet,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

export const placeholdersPlugin = (string = 'name') => {
  class PlaceholderWidget extends WidgetType {
    name: string;
    constructor(name) {
      super();
      this.name = name;
    }
    eq(other: PlaceholderWidget) {
      return this.name == other.name;
    }
    toDOM() {
      let elt = document.createElement('span');
      elt.style.cssText = `
        border: 1px solid rgb(145, 202, 255);
        border-radius: 4px;
        line-height: 20px;
        background: rgb(230, 244, 255);
        color: rgb(9, 88, 217);
        font-size: 12px;
        padding: 2px 7px;
        user-select: none;
       `;
      elt.textContent = this.name;
      return elt;
    }
    ignoreEvent() {
      return false;
    }
  }
  const placeholderMatcher = new MatchDecorator({
    regexp: /\[\[(.+?)\]\]/g,
    decoration: (match) => {
      return Decoration.replace({ widget: new PlaceholderWidget(match[1]) });
    },
  });

  // 变量占位符
  return ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders);
      }
    },
    {
      decorations: (v) => v.placeholders,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    },
  );
};
