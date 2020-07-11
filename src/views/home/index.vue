<template>
    <div class="home-container">
        <div class="box-1 logo" :style="[{height:height+'px'}]" />
    </div>
</template>

<script>

export default {
    name: 'Home',
    computed: {
        height() {
            return this.$store.getters.winHeight - 205;
        }
    }
}
</script>

<style lang="scss" scoped>
.home-container {
    padding: 10px 0;
    .box-1  {
        width: 528px;
        margin: auto;
        background: url(../../assets/images/logo-index.png) center center no-repeat;
    }
}
</style>
