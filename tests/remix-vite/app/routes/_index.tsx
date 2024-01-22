import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <div>normal content</div>
      {typeof window === "undefined" ? (
        <div>SERVER RENDERED DIV</div>
      ) : (
        <span>BROWSER RENDERED SPAN</span>
      )}
      <div>
        <div>Hello world!</div>
        <button>CLOSE</button>
      </div>
    </>
  );
}
