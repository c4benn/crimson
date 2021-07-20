<script>
export default {
  name: "SvgChecked",
  functional: true,

  render(h, c) {
    const span = (d, c) => h("span", d, c);
    const svg = (d, c) => h("svg", d, c);
    const path = (d) => h("path", d);
    const polyline = (d) => h("polyline", d);

    const $data = c.data;
    const $attrs = $data.attrs || {};

    return span(
      {
        ...$data,
        attrs: {
          title: "checked icon",
          ...$attrs,
        },
      },
      [
        svg(
          {
            attrs: {
              fill: "none",
              stroke: "currentColor",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              version: "1.1",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
            },
          },
          [
            path({
              attrs: {
                d: "M22 11.07V12a10 10 0 1 1-5.93-9.14",
              },
            }),
            polyline({
              attrs: {
                points: "23 3 12 14 9 11",
              },
            }),
          ]
        ),
      ]
    );
  },
};
</script>
