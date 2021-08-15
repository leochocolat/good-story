<template>
    <div class="page-home">

        <Navigation route="/contact" route-name="Contact" />

        <ButtonHold ref="buttonHold" :label="labels[state]" />

        <div class="container">

            <TextHome ref="text" :content="sections[currentIndex].text" />

        </div>

    </div>
</template>

<script src="./home/script.js"></script>
<style src="./home/style.scss" lang="scss" scoped></style>
