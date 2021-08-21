<template>
    <div class="page-contact">

        <Navigation route="/" route-name="Accueil" />

        <div class="container">

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

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
