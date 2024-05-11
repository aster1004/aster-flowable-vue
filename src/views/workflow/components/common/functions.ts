/*计算公式:函数装饰器*/
import {
  WidgetType,
  Decoration,
  DecorationSet,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
} from '@codemirror/view';
export const functionPlugin = () => {
  class FunctionWidget extends WidgetType {
    text: string;

    constructor(text: string) {
      super();
      this.text = text;
    }

    eq(other: FunctionWidget) {
      return this.text == other.text;
    }

    toDOM() {
      const elt = document.createElement('span');
      elt.style.cssText = `
      color: #d73a49;
      font-size: 15px;
      `;
      elt.textContent = this.text;
      // const span = document.createElement('span');
      // span.style.cssText = 'color: #6a737d;';
      // span.textContent = "(";
      // elt.appendChild(span);
      console.log(elt);
      return elt;
    }
    ignoreEvent() {
      return true;
    }
  }

  const functionMatcher = new MatchDecorator({
    // regexp: /func\.(.+?)\(/g,
    // regexp: /([A-Z]+)\s*\(/g,
    regexp: /([A-Z]+)(?=[^\w(]*\()/g, //匹配大写字母开头的函数名直到遇到第一个左括号
    decoration: (match) => {
      const funcName = match[0];
      return Decoration.replace({
        widget: new FunctionWidget(match[0]),
      });
    },
  });

  return ViewPlugin.fromClass(
    class {
      function: DecorationSet;
      constructor(view: EditorView) {
        this.function = functionMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.function = functionMatcher.updateDeco(update, this.function);
      }
    },
    {
      decorations: (v) => v.function,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.function || Decoration.none;
        }),
    },
  );
};
