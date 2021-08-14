<template>
    <div class="the-navigation">

        <nuxt-link v-if="isHome" class="button button-contact" to="/contact">
            Contact
        </nuxt-link>

        <nuxt-link v-if="isContact" class="button button-contact" to="/">
            Accueil
        </nuxt-link>

    </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped></style>
