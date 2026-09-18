import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Bi } from "./Bi";
import { useTranslation } from "@/lib/translation";

/**
 * Translates the visible English text of everything rendered inside it into the
 * chosen language, without every page having to be rewritten.
 *
 * - plain text inside elements becomes a <Bi> label (chosen language on top,
 *   small English underneath)
 * - common text props (label, title, subtitle, sub, hint, placeholder…) are
 *   swapped for the chosen-language wording
 *
 * Anything that is not English words — numbers, prices, code, text already in
 * an Indian script — is left exactly as it is.
 */

const TEXT_PROPS = [
  "label",
  "title",
  "subtitle",
  "sub",
  "hint",
  "note",
  "placeholder",
  "description",
  "caption",
  "aria-label",
] as const;

/** Tags whose children must stay plain strings. */
const PLAIN_TAGS = new Set(["option", "title", "textarea"]);
/** Tags we never touch. */
const SKIP_TAGS = new Set(["code", "pre", "script", "style", "svg", "path", "input", "img"]);

/** Indic / CJK ranges — text already in another script is left alone. */
const NON_LATIN = /[\u0590-\u1FFF\u2E80-\uA4CF\uA800-\uD7FF]/;

function isEnglishPhrase(value: string): boolean {
  const text = value.trim();
  if (text.length < 2 || text.length > 180) return false;
  if (!/[A-Za-z]{2}/.test(text)) return false;
  if (NON_LATIN.test(text)) return false;
  return true;
}

export function AutoTranslate({ children }: { children: ReactNode }) {
  const { lang, text } = useTranslation();

  if (lang === "en") return <>{children}</>;

  const walk = (node: ReactNode, depth: number, plain: boolean): ReactNode => {
    if (depth > 14) return node;

    if (typeof node === "string") {
      if (!isEnglishPhrase(node)) return node;
      return plain ? text(node) : <Bi>{node}</Bi>;
    }

    if (Array.isArray(node)) {
      return node.map((child, index) => {
        const walked = walk(child as ReactNode, depth + 1, plain);
        if (isValidElement(walked)) {
          return walked.key != null ? walked : cloneElement(walked, { key: `t-${index}` });
        }
        if (typeof walked === "string") return <span key={`t-${index}`}>{walked}</span>;
        return walked;
      });
    }

    if (!isValidElement(node)) return node;

    const element = node as ReactElement<Record<string, unknown>>;
    const tag = typeof element.type === "string" ? element.type : null;
    if (tag && SKIP_TAGS.has(tag)) return element;

    const nextProps: Record<string, unknown> = {};
    let changed = false;

    for (const prop of TEXT_PROPS) {
      const value = element.props[prop];
      if (typeof value === "string" && isEnglishPhrase(value)) {
        nextProps[prop] = text(value);
        changed = true;
      }
    }

    const children = element.props["children"] as ReactNode | undefined;
    if (children !== undefined && children !== null) {
      nextProps["children"] = walk(children, depth + 1, plain || (tag ? PLAIN_TAGS.has(tag) : false));
      changed = true;
    }

    return changed ? cloneElement(element, nextProps) : element;
  };

  return <>{walk(children, 0, false)}</>;
}
