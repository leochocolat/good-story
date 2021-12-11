<template>
    <div class="page-contact">

        <div ref="container" class="container">

            <div class="row">

                <div class="col intro">

                    <h1 class="title">
                        {{ data.contact.intro.title }}
                    </h1>

                    <p class="paragraph" v-html="data.contact.intro.content"></p>

                </div>

                <div class="col">

                    <div class="block-infos email">

                        <div class="title">
                            {{ data.contact.email.title }}
                        </div>

                        <a v-for="(item, index) in data.contact.email.emails" :key="`email-${index}`" :href="`mailto:${item}`">{{ item }}</a>

                    </div>

                    <div v-for="(item, index) in data.contact.addresses" :key="index" class="block-infos address">

                        <div class="title">
                            {{ item.title }}
                        </div>

                        <p class="paragraph" v-html="item.content"></p>

                    </div>

                    <div class="block-infos phone">

                        <div class="title">
                            {{ data.contact.phone.title }}
                        </div>

                        <a v-for="(item, index) in data.contact.phone.phones" :key="`phone-${index}`" :href="`tel:+${item}`">{{ item }}</a>

                    </div>

                    <div class="block-infos socials">

                        <div class="title">
                            {{ data.contact.socials.title }}
                        </div>

                        <a v-for="(item, index) in data.contact.socials.socials" :key="`socials-${index}`" :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>

                    </div>

                    <div ref="logoContainer" class="logo-container"></div>

                </div>

            </div>

        </div>

        <Navigation route="/" route-name="Accueil" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
