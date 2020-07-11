<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        this.$store.dispatch('app/setWinHeight', document.body.clientHeight)
        window.addEventListener('resize', this.setHeight)
    },
    destroyed() {
        if (window.removeEventListener) {
            window.removeEventListener('resize', this.setHeight);
        } else if (window.detachEvent) {
            window.detachEvent('resize', this.setHeight);
        }
    },
    methods: {
        /**
         * 设置高度自适应
         */
        setHeight() {
            this.$store.dispatch('app/setWinHeight', document.body.clientHeight)
        }
    }
}
</script>
