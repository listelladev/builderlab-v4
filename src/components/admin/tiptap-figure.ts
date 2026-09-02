import { mergeAttributes, Node } from "@tiptap/core";

// <figure><img><figcaption>…</figcaption></figure> as one block node: the
// image is fixed, the caption is inline-editable underneath it. This is how
// the old block editor's "Image + alt text + caption" trio survives inside
// a single WYSIWYG surface.
export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "inline*",
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.querySelector("img")?.getAttribute("src") || null,
      },
      alt: {
        default: "",
        parseHTML: (el) => el.querySelector("img")?.getAttribute("alt") || "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "figure", contentElement: "figcaption" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      {},
      ["img", mergeAttributes(HTMLAttributes, { draggable: "false", contenteditable: "false" })],
      ["figcaption", 0],
    ];
  },

  addKeyboardShortcuts() {
    return {
      // Enter inside a caption starts a fresh paragraph below the figure
      // instead of splitting the figure in two.
      Enter: () => {
        if (!this.editor.isActive(this.name)) return false;
        const pos = this.editor.state.selection.$from.after(1);
        return this.editor
          .chain()
          .insertContentAt(pos, { type: "paragraph" })
          .focus(pos + 1)
          .run();
      },
    };
  },
});
