<template>
    <nuxt-link class="button button-home" to="/">
        <LogoShort v-if="breakpoint !== 'small'" ref="logoBlack" class="black small" />
        <Logo v-else ref="logoBlack" class="black large" />

        <LogoShort v-if="breakpoint !== 'small'" ref="logoWhite" class="white small" />
        <Logo v-else ref="logoWhite" class="white large" />
    </nuxt-link>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
