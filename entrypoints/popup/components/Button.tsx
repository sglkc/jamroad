import { ButtonHTMLAttributes } from "preact/compat";

export default function Button(props: ButtonHTMLAttributes) {
  return (
    <button
      {...props}
      class={
        'px-4 py-2 bg-light-800 text-dark-800 b-1 b-black disabled:opacity-75 '
          + props.class
      }
    />
  )
}
