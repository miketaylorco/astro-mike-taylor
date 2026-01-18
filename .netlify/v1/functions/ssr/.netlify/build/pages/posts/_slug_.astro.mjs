import { s as sanityClient } from '../../chunks/page-ssr_DzKzsCPd.mjs';
import { c as createComponent, d as createAstro, m as maybeRenderHead, s as spreadAttributes, k as renderSlot, r as renderTemplate, i as renderComponent, f as addAttribute, j as renderScript, l as Fragment } from '../../chunks/astro/server_YtkIaNi7.mjs';
import 'piccolore';
import { createImageUrlBuilder } from '@sanity/image-url';
import { LIST_NEST_MODE_HTML, isPortableTextToolkitList, isPortableTextListItemBlock, isPortableTextToolkitSpan, isPortableTextBlock, isPortableTextToolkitTextNode, nestLists, buildMarksTree } from '@portabletext/toolkit';
import 'clsx';
import { g as getUser } from '../../chunks/supabase_CCpIJb0g.mjs';
import { $ as $$Main } from '../../chunks/main_D51iTxx8.mjs';
export { renderers } from '../../renderers.mjs';

function isComponent(it) {
  return typeof it === "function";
}
function mergeComponents(components, overrides) {
  const cmps = { ...components };
  for (const [key, override] of Object.entries(overrides)) {
    const current = components[key];
    const value = !current || isComponent(override) || isComponent(current) ? override : {
      ...current,
      ...override
    };
    cmps[key] = value;
  }
  return cmps;
}
const nodeComponentsMap = /* @__PURE__ */ new WeakMap();
function setNodeComponents(node, Default, Unknown) {
  nodeComponentsMap.set(node, { Default, Unknown });
}
function getNodeComponents(node) {
  return nodeComponentsMap.get(node);
}

const getTemplate = (prop, type) => `PortableText [components.${prop}] is missing "${type}"`;
const unknownTypeWarning = (type) => getTemplate("type", type);
const unknownMarkWarning = (markType) => getTemplate("mark", markType);
const unknownBlockWarning = (style) => getTemplate("block", style);
const unknownListWarning = (listItem) => getTemplate("list", listItem);
const unknownListItemWarning = (listStyle) => getTemplate("listItem", listStyle);
const getWarningMessage = (nodeType, type) => {
  const fncs = {
    block: unknownBlockWarning,
    list: unknownListWarning,
    listItem: unknownListItemWarning,
    mark: unknownMarkWarning,
    type: unknownTypeWarning
  };
  return fncs[nodeType](type);
};
function printWarning(message) {
  console.warn(message);
}

const key = Symbol("astro-portabletext");
function usePortableText(node) {
  if (!(key in globalThis)) {
    throw new Error(`PortableText "context" has not been initialised`);
  }
  return globalThis[key](node);
}

const $$Astro$c = createAstro();
const $$Block = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Block;
  const props = Astro2.props;
  const { node, index, isInline, ...attrs } = props;
  const styleIs = (style) => style === node.style;
  const { getUnknownComponent } = usePortableText(node);
  const UnknownStyle = getUnknownComponent();
  return renderTemplate`${styleIs("h1") ? renderTemplate`${maybeRenderHead()}<h1${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h1>` : styleIs("h2") ? renderTemplate`<h2${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h2>` : styleIs("h3") ? renderTemplate`<h3${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h3>` : styleIs("h4") ? renderTemplate`<h4${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h4>` : styleIs("h5") ? renderTemplate`<h5${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h5>` : styleIs("h6") ? renderTemplate`<h6${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h6>` : styleIs("blockquote") ? renderTemplate`<blockquote${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</blockquote>` : styleIs("normal") ? renderTemplate`<p${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</p>` : renderTemplate`${renderComponent($$result, "UnknownStyle", UnknownStyle, { ...props }, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/Block.astro", void 0);

const $$HardBreak = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<br>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/HardBreak.astro", void 0);

const $$Astro$b = createAstro();
const $$List = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$List;
  const { node, index, isInline, ...attrs } = Astro2.props;
  const listItemIs = (listItem) => listItem === node.listItem;
  return renderTemplate`${listItemIs("menu") ? renderTemplate`${maybeRenderHead()}<menu${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</menu>` : listItemIs("number") ? renderTemplate`<ol${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</ol>` : renderTemplate`<ul${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</ul>`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/List.astro", void 0);

const $$Astro$a = createAstro();
const $$ListItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$ListItem;
  const { node, index, isInline, ...attrs } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</li>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/ListItem.astro", void 0);

const $$Astro$9 = createAstro();
const $$Mark = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Mark;
  const props = Astro2.props;
  const { node, index, isInline, ...attrs } = props;
  const markTypeIs = (markType) => markType === node.markType;
  const { getUnknownComponent } = usePortableText(node);
  const UnknownMarkType = getUnknownComponent();
  return renderTemplate`${markTypeIs("code") ? renderTemplate`${maybeRenderHead()}<code${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</code>` : markTypeIs("em") ? renderTemplate`<em${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</em>` : markTypeIs("link") ? renderTemplate`<a${addAttribute(node.markDef.href, "href")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</a>` : markTypeIs("strike-through") ? renderTemplate`<del${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</del>` : markTypeIs("strong") ? renderTemplate`<strong${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</strong>` : markTypeIs("underline") ? renderTemplate`<span style="text-decoration: underline;"${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</span>` : renderTemplate`${renderComponent($$result, "UnknownMarkType", UnknownMarkType, { ...props }, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/Mark.astro", void 0);

const $$Astro$8 = createAstro();
const $$Text = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Text;
  const { node } = Astro2.props;
  return renderTemplate`${node.text}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/Text.astro", void 0);

const $$UnknownBlock = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<p data-portabletext-unknown="block">${renderSlot($$result, $$slots["default"])}</p>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/UnknownBlock.astro", void 0);

const $$UnknownList = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<ul data-portabletext-unknown="list">${renderSlot($$result, $$slots["default"])}</ul>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/UnknownList.astro", void 0);

const $$UnknownListItem = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<li data-portabletext-unknown="listitem">${renderSlot($$result, $$slots["default"])}</li>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/UnknownListItem.astro", void 0);

const $$UnknownMark = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<span data-portabletext-unknown="mark">${renderSlot($$result, $$slots["default"])}</span>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/UnknownMark.astro", void 0);

const $$Astro$7 = createAstro();
const $$UnknownType = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$UnknownType;
  const { node, isInline } = Astro2.props;
  const warning = getWarningMessage("type", node._type);
  return renderTemplate`${isInline ? renderTemplate`${maybeRenderHead()}<span style="display:none" data-portabletext-unknown="type">${warning}</span>` : renderTemplate`<div style="display:none" data-portabletext-unknown="type">${warning}</div>`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/UnknownType.astro", void 0);

const $$Astro$6 = createAstro();
const $$PortableText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$PortableText;
  const {
    value,
    components: componentOverrides = {},
    listNestingMode = LIST_NEST_MODE_HTML,
    onMissingComponent = true
  } = Astro2.props;
  const components = mergeComponents(
    {
      type: {},
      unknownType: $$UnknownType,
      block: {
        h1: $$Block,
        h2: $$Block,
        h3: $$Block,
        h4: $$Block,
        h5: $$Block,
        h6: $$Block,
        blockquote: $$Block,
        normal: $$Block
      },
      unknownBlock: $$UnknownBlock,
      list: {
        bullet: $$List,
        number: $$List,
        menu: $$List
      },
      unknownList: $$UnknownList,
      listItem: {
        bullet: $$ListItem,
        number: $$ListItem,
        menu: $$ListItem
      },
      unknownListItem: $$UnknownListItem,
      mark: {
        code: $$Mark,
        em: $$Mark,
        link: $$Mark,
        "strike-through": $$Mark,
        strong: $$Mark,
        underline: $$Mark
      },
      unknownMark: $$UnknownMark,
      text: $$Text,
      hardBreak: $$HardBreak
    },
    componentOverrides
  );
  const noop = () => {
  };
  const missingComponentHandler = ((handler) => {
    if (typeof handler === "function") {
      return handler;
    }
    return !handler ? noop : printWarning;
  })(onMissingComponent);
  const asComponentProps = (node, index, isInline) => ({
    node,
    index,
    isInline
  });
  const provideComponent = (nodeType, type, fallbackComponent) => {
    const component = ((component2) => {
      return component2[type] || component2;
    })(components[nodeType]);
    if (isComponent(component)) {
      return component;
    }
    missingComponentHandler(getWarningMessage(nodeType, type), {
      nodeType,
      type
    });
    return fallbackComponent;
  };
  let fallbackRenderOptions;
  const portableTextRender = (options, isInline) => {
    if (!fallbackRenderOptions) {
      throw new Error(
        "[PortableText portableTextRender] fallbackRenderOptions is undefined"
      );
    }
    const renderChildren = (children, inline = false) => {
      return children?.map(portableTextRender(options, inline)) ?? [];
    };
    const renderOptions = { ...fallbackRenderOptions, ...options ?? {} };
    return function renderNode(node, index) {
      function run(handler, props) {
        if (!isComponent(handler)) {
          throw new Error(
            `[PortableText render] No handler found for node type ${node._type}.`
          );
        }
        return handler(props);
      }
      if (isPortableTextToolkitList(node)) {
        const UnknownComponent2 = components.unknownList ?? $$UnknownList;
        setNodeComponents(node, $$List, UnknownComponent2);
        return run(renderOptions.list, {
          Component: provideComponent("list", node.listItem, UnknownComponent2),
          props: asComponentProps(node, index, false),
          children: renderChildren(node.children, false)
        });
      }
      if (isPortableTextListItemBlock(node)) {
        const { listItem, ...blockNode } = node;
        const isStyled = node.style && node.style !== "normal";
        node.children = isStyled ? renderNode(blockNode, index) : buildMarksTree(node);
        const UnknownComponent2 = components.unknownListItem ?? $$UnknownListItem;
        setNodeComponents(node, $$ListItem, UnknownComponent2);
        return run(renderOptions.listItem, {
          Component: provideComponent(
            "listItem",
            node.listItem,
            UnknownComponent2
          ),
          props: asComponentProps(node, index, false),
          children: isStyled ? node.children : renderChildren(node.children, true)
        });
      }
      if (isPortableTextToolkitSpan(node)) {
        const UnknownComponent2 = components.unknownMark ?? $$UnknownMark;
        setNodeComponents(node, $$Mark, UnknownComponent2);
        return run(renderOptions.mark, {
          Component: provideComponent("mark", node.markType, UnknownComponent2),
          props: asComponentProps(node, index, true),
          children: renderChildren(node.children, true)
        });
      }
      if (isPortableTextBlock(node)) {
        node.style ??= "normal";
        node.children = buildMarksTree(node);
        const UnknownComponent2 = components.unknownBlock ?? $$UnknownBlock;
        setNodeComponents(node, $$Block, UnknownComponent2);
        return run(renderOptions.block, {
          Component: provideComponent("block", node.style, UnknownComponent2),
          props: asComponentProps(node, index, false),
          children: renderChildren(node.children, true)
        });
      }
      if (isPortableTextToolkitTextNode(node)) {
        const isHardBreak = "\n" === node.text;
        const props = asComponentProps(node, index, true);
        if (isHardBreak) {
          return run(renderOptions.hardBreak, {
            Component: isComponent(components.hardBreak) ? components.hardBreak : $$HardBreak,
            props
          });
        }
        return run(renderOptions.text, {
          Component: isComponent(components.text) ? components.text : $$Text,
          props
        });
      }
      const UnknownComponent = components.unknownType ?? $$UnknownType;
      return run(renderOptions.type, {
        Component: provideComponent("type", node._type, UnknownComponent),
        props: asComponentProps(
          node,
          index,
          isInline ?? false
          /* default to block */
        )
      });
    };
  };
  globalThis[key] = (node) => ({
    getDefaultComponent: provideDefaultComponent.bind(null, node),
    getUnknownComponent: provideUnknownComponent.bind(null, node),
    render: (options) => node.children?.map(portableTextRender(options))
  });
  const provideDefaultComponent = (node) => {
    const DefaultComponent = getNodeComponents(node)?.Default;
    if (DefaultComponent) return DefaultComponent;
    if (isPortableTextToolkitList(node)) return $$List;
    if (isPortableTextListItemBlock(node)) return $$ListItem;
    if (isPortableTextToolkitSpan(node)) return $$Mark;
    if (isPortableTextBlock(node)) return $$Block;
    if (isPortableTextToolkitTextNode(node)) {
      return "\n" === node.text ? $$HardBreak : $$Text;
    }
    return $$UnknownType;
  };
  const provideUnknownComponent = (node) => {
    const UnknownComponent = getNodeComponents(node)?.Unknown;
    if (UnknownComponent) return UnknownComponent;
    if (isPortableTextToolkitList(node)) {
      return components.unknownList ?? $$UnknownList;
    }
    if (isPortableTextListItemBlock(node)) {
      return components.unknownListItem ?? $$UnknownListItem;
    }
    if (isPortableTextToolkitSpan(node)) {
      return components.unknownMark ?? $$UnknownMark;
    }
    if (isPortableTextBlock(node)) {
      return components.unknownBlock ?? $$UnknownBlock;
    }
    if (!isPortableTextToolkitTextNode(node)) {
      return components.unknownType ?? $$UnknownType;
    }
    throw new Error(
      `[PortableText getUnknownComponent] Unable to provide component with node type ${node._type}`
    );
  };
  const blocks = Array.isArray(value) ? value : value ? [value] : [];
  const nodes = nestLists(blocks, listNestingMode);
  const render = (options) => {
    fallbackRenderOptions = options;
    return portableTextRender(options);
  };
  const createSlotRenderer = (slotName) => Astro2.slots.render.bind(Astro2.slots, slotName);
  const slots = [
    "type",
    "block",
    "list",
    "listItem",
    "mark",
    "text",
    "hardBreak"
  ].reduce(
    (obj, name) => {
      obj[name] = Astro2.slots.has(name) ? createSlotRenderer(name) : void 0;
      return obj;
    },
    {}
  );
  return renderTemplate`${(() => {
    const renderNode = (slotRenderer) => {
      return ({ Component, props, children }) => slotRenderer?.([{ Component, props, children }]) ?? renderTemplate`${renderComponent($$result, "Component", Component, { ...props }, { "default": ($$result2) => renderTemplate`${children}` })}`;
    };
    return nodes.map(
      render({
        type: renderNode(slots.type),
        block: renderNode(slots.block),
        list: renderNode(slots.list),
        listItem: renderNode(slots.listItem),
        mark: renderNode(slots.mark),
        text: renderNode(slots.text),
        hardBreak: renderNode(slots.hardBreak)
      })
    );
  })()}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/astro-portabletext/components/PortableText.astro", void 0);

const $$Astro$5 = createAstro();
const $$ImageWithCaption = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$ImageWithCaption;
  const { node } = Astro2.props;
  const { projectId, dataset } = sanityClient.config();
  const urlFor = (source) => projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;
  const imageUrl = node.image ? urlFor(node.image)?.width(800).url() : null;
  return renderTemplate`${imageUrl && renderTemplate`${maybeRenderHead()}<figure class="my-6"><img${addAttribute(imageUrl, "src")}${addAttribute(node.alt || "", "alt")} class="rounded-lg w-full">${(node.caption || node.attribution) && renderTemplate`<figcaption class="text-sm text-gray-600 mt-2">${node.caption}${node.attribution && renderTemplate`<span class="italic"> — ${node.attribution}</span>`}</figcaption>`}</figure>`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/components/ImageWithCaption.astro", void 0);

const $$Astro$4 = createAstro();
const $$YouTube = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$YouTube;
  const { node } = Astro2.props;
  function getYouTubeId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  const videoId = node.url ? getYouTubeId(node.url) : null;
  return renderTemplate`${videoId && renderTemplate`${maybeRenderHead()}<figure class="my-6"><div class="aspect-video"><iframe${addAttribute(`https://www.youtube.com/embed/${videoId}`, "src")}${addAttribute(node.title || "YouTube video", "title")} class="w-full h-full rounded-lg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>${node.title && renderTemplate`<figcaption class="text-sm text-gray-600 mt-2">${node.title}</figcaption>`}</figure>`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/components/YouTube.astro", void 0);

const $$Astro$3 = createAstro();
const $$ImageGallery = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ImageGallery;
  const { node } = Astro2.props;
  const { projectId, dataset } = sanityClient.config();
  const urlFor = (source) => projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;
  const layout = node.layout || "grid";
  const columns = node.columns || 3;
  const gridColsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  function getYouTubeId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  const items = node.items || node.images || [];
  return renderTemplate`${maybeRenderHead()}<div class="my-6"> ${node.title && renderTemplate`<h3 class="text-xl font-semibold mb-4">${node.title}</h3>`} ${layout === "grid" && renderTemplate`<div${addAttribute(`grid ${gridColsClass} gap-4`, "class")}> ${items.map((item) => {
    if (item._type === "galleryVideo") {
      const videoId = item.url ? getYouTubeId(item.url) : null;
      return videoId && renderTemplate`<figure> <div class="aspect-video"> <iframe${addAttribute(`https://www.youtube.com/embed/${videoId}`, "src")}${addAttribute(item.title || "YouTube video", "title")} class="w-full h-full rounded-lg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div> ${item.title && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.title}</figcaption>`} </figure>`;
    } else {
      const imageUrl = item.image ? urlFor(item.image)?.width(400).height(300).url() : null;
      return imageUrl && renderTemplate`<figure> <img${addAttribute(imageUrl, "src")}${addAttribute(item.alt || "", "alt")} class="rounded-lg w-full h-48 object-cover"> ${item.caption && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.caption}</figcaption>`} </figure>`;
    }
  })} </div>`} ${layout === "masonry" && renderTemplate`<div${addAttribute(`columns-1 sm:columns-2 lg:columns-${columns} gap-4`, "class")}> ${items.map((item) => {
    if (item._type === "galleryVideo") {
      const videoId = item.url ? getYouTubeId(item.url) : null;
      return videoId && renderTemplate`<figure class="mb-4 break-inside-avoid"> <div class="aspect-video"> <iframe${addAttribute(`https://www.youtube.com/embed/${videoId}`, "src")}${addAttribute(item.title || "YouTube video", "title")} class="w-full h-full rounded-lg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div> ${item.title && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.title}</figcaption>`} </figure>`;
    } else {
      const imageUrl = item.image ? urlFor(item.image)?.width(400).url() : null;
      return imageUrl && renderTemplate`<figure class="mb-4 break-inside-avoid"> <img${addAttribute(imageUrl, "src")}${addAttribute(item.alt || "", "alt")} class="rounded-lg w-full"> ${item.caption && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.caption}</figcaption>`} </figure>`;
    }
  })} </div>`} ${layout === "carousel" && renderTemplate`<div class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"> ${items.map((item) => {
    if (item._type === "galleryVideo") {
      const videoId = item.url ? getYouTubeId(item.url) : null;
      return videoId && renderTemplate`<figure class="flex-shrink-0 snap-center w-4/5 sm:w-2/3"> <div class="aspect-video"> <iframe${addAttribute(`https://www.youtube.com/embed/${videoId}`, "src")}${addAttribute(item.title || "YouTube video", "title")} class="w-full h-full rounded-lg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div> ${item.title && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.title}</figcaption>`} </figure>`;
    } else {
      const imageUrl = item.image ? urlFor(item.image)?.width(600).height(400).url() : null;
      return imageUrl && renderTemplate`<figure class="flex-shrink-0 snap-center w-4/5 sm:w-2/3"> <img${addAttribute(imageUrl, "src")}${addAttribute(item.alt || "", "alt")} class="rounded-lg w-full"> ${item.caption && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.caption}</figcaption>`} </figure>`;
    }
  })} </div>`} ${layout === "lightbox" && renderTemplate`<div${addAttribute(`grid ${gridColsClass} gap-4`, "class")}> ${items.map((item) => {
    if (item._type === "galleryVideo") {
      const videoId = item.url ? getYouTubeId(item.url) : null;
      return videoId && renderTemplate`<figure> <div class="aspect-video"> <iframe${addAttribute(`https://www.youtube.com/embed/${videoId}`, "src")}${addAttribute(item.title || "YouTube video", "title")} class="w-full h-full rounded-lg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div> ${item.title && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.title}</figcaption>`} </figure>`;
    } else {
      const thumbUrl = item.image ? urlFor(item.image)?.width(400).height(300).url() : null;
      const fullUrl = item.image ? urlFor(item.image)?.width(1200).url() : null;
      return thumbUrl && renderTemplate`<a${addAttribute(fullUrl, "href")} target="_blank" rel="noopener" class="block"> <figure> <img${addAttribute(thumbUrl, "src")}${addAttribute(item.alt || "", "alt")} class="rounded-lg w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-zoom-in"> ${item.caption && renderTemplate`<figcaption class="text-sm text-gray-600 mt-1">${item.caption}</figcaption>`} </figure> </a>`;
    }
  })} </div>`} </div>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/components/ImageGallery.astro", void 0);

const $$Astro$2 = createAstro();
const $$PortableTextBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PortableTextBlock;
  const { node } = Astro2.props;
  const style = node.style || "normal";
  return renderTemplate`${style === "lead" && renderTemplate`${maybeRenderHead()}<p class="text-xl text-gray-700 leading-relaxed mb-6 first:mt-0">${renderSlot($$result, $$slots["default"])}</p>`}${style === "small" && renderTemplate`<p class="text-sm text-gray-500 mb-4">${renderSlot($$result, $$slots["default"])}</p>`}${style === "callout" && renderTemplate`<div class="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg"><p class="text-amber-900">${renderSlot($$result, $$slots["default"])}</p></div>`}${style === "blockquote" && renderTemplate`<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">${renderSlot($$result, $$slots["default"])}</blockquote>`}${style === "h1" && renderTemplate`<h1 class="text-4xl font-bold mt-8 mb-4">${renderSlot($$result, $$slots["default"])}</h1>`}${style === "h2" && renderTemplate`<h2 class="text-3xl font-bold mt-8 mb-3">${renderSlot($$result, $$slots["default"])}</h2>`}${style === "h3" && renderTemplate`<h3 class="text-2xl font-semibold mt-6 mb-3">${renderSlot($$result, $$slots["default"])}</h3>`}${style === "h4" && renderTemplate`<h4 class="text-xl font-semibold mt-6 mb-2">${renderSlot($$result, $$slots["default"])}</h4>`}${style === "normal" && renderTemplate`<p class="mb-4">${renderSlot($$result, $$slots["default"])}</p>`}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/components/PortableTextBlock.astro", void 0);

const $$Astro$1 = createAstro();
const $$ProtectedContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProtectedContent;
  const { documentId, isAuthenticated, returnUrl = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="protected-content"${addAttribute(documentId, "data-document-id")}${addAttribute(isAuthenticated.toString(), "data-authenticated")}> ${isAuthenticated ? renderTemplate`<!-- Authenticated: Show loading state then fetch content -->
    <div class="content-loader"> <div class="loading-state"> <div class="animate-pulse"> <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div> <div class="h-4 bg-gray-200 rounded w-full mb-4"></div> <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div> <div class="h-4 bg-gray-200 rounded w-2/3"></div> </div> <p class="text-gray-500 text-center mt-4">Loading protected content...</p> </div> <div class="loaded-content prose hidden"></div> <div class="error-state hidden"> <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"> <p class="text-red-600 font-medium">Unable to load content</p> <p class="text-red-500 text-sm mt-2 error-message"></p> </div> </div> </div>` : renderTemplate`<!-- Not authenticated: Show sign-in form -->
    <div class="auth-required bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-lg p-8"> <div class="text-center mb-6"> <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> <h3 class="text-xl font-semibold text-gray-900">Protected Content</h3> <p class="text-gray-600 mt-2">Sign in to continue reading this article.</p> </div> <form action="/api/auth/signin" method="POST" class="space-y-4"> <input type="hidden" name="next"${addAttribute(returnUrl, "value")}> <div> <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label> <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com"> </div> <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
Send Magic Link
</button> <p class="text-xs text-gray-500 text-center">
This content requires an invite. If you don't have access, contact the site administrator.
</p> </form> </div>`} </div> ${renderScript($$result, "/Users/miketaylor/My Websites/astro-mike-taylor/src/components/ProtectedContent.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/components/ProtectedContent.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const contentProps = { title: "Posts" };
  const user = await getUser(Astro2.cookies);
  const isAuthenticated = !!user;
  const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  image,
  accessLevel,
  teaser,
  teaserImage,
  "body": select(
    accessLevel == "protected" => null,
    body
  )
}`;
  const post = await sanityClient.fetch(POST_QUERY, Astro2.params);
  const { projectId, dataset } = sanityClient.config();
  const urlFor = (source) => projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;
  const postImageUrl = post.image ? urlFor(post.image)?.width(550).height(310).url() : null;
  const teaserImageUrl = post.teaserImage ? urlFor(post.teaserImage)?.width(550).height(310).url() : null;
  const isProtected = post.accessLevel === "protected";
  const returnUrl = `/posts/${post.slug.current}`;
  const portableTextComponents = {
    type: {
      imageWithCaption: $$ImageWithCaption,
      youtube: $$YouTube,
      imageGallery: $$ImageGallery
    },
    block: {
      lead: $$PortableTextBlock,
      small: $$PortableTextBlock,
      callout: $$PortableTextBlock,
      blockquote: $$PortableTextBlock,
      h1: $$PortableTextBlock,
      h2: $$PortableTextBlock,
      h3: $$PortableTextBlock,
      h4: $$PortableTextBlock,
      normal: $$PortableTextBlock
    }
  };
  return renderTemplate`${renderComponent($$result, "Main", $$Main, { "content": contentProps }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4"> <div class="flex items-center justify-between"> <a href="/posts" class="hover:underline">&larr; Back to posts</a> ${isAuthenticated && renderTemplate`<a href="/api/auth/signout" class="text-sm text-gray-500 hover:underline">Sign out</a>`} </div> ${isProtected && renderTemplate`<div class="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm w-fit"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg>
Protected Content
</div>`} ${postImageUrl && renderTemplate`<img${addAttribute(postImageUrl, "src")}${addAttribute(post.title, "alt")} class="aspect-video rounded-xl" width="550" height="310">`} <h1 class="text-4xl font-bold mb-8">${post.title}</h1> <div class="prose"> <p>Published: ${new Date(post.publishedAt).toLocaleDateString()}</p> ${isProtected ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${Array.isArray(post.teaser) && post.teaser.length > 0 && renderTemplate`<div class="teaser-content mb-8"> ${renderComponent($$result3, "PortableText", $$PortableText, { "value": post.teaser, "components": portableTextComponents })} </div>`}${teaserImageUrl && renderTemplate`<img${addAttribute(teaserImageUrl, "src")}${addAttribute(`${post.title} teaser`, "alt")} class="rounded-lg mb-8" width="550" height="310">`}<div class="border-t border-gray-200 my-8 pt-8"> ${renderComponent($$result3, "ProtectedContent", $$ProtectedContent, { "documentId": post._id, "isAuthenticated": isAuthenticated, "returnUrl": returnUrl })} </div> ` })}` : Array.isArray(post.body) && renderTemplate`${renderComponent($$result2, "PortableText", $$PortableText, { "value": post.body, "components": portableTextComponents })}`} </div> </main> ` })}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/posts/[slug].astro", void 0);

const $$file = "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/posts/[slug].astro";
const $$url = "/posts/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
