<template>
    <div class="page-home">

        <Navigation page="home" />

        <ButtonHold ref="buttonHold" :label="labels[state]" />

    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
