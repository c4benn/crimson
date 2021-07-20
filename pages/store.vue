<script>
export default {
  name: 'Store',
  head() {
    return {
      title: 'store page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'check out our shop',
        },
      ],
    }
  },
  render(h) {
    return h('div', { style: 'background:red;width:100vw;height:100vh;' })
  },
}
</script>

<style></style>
