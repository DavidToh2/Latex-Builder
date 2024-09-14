<script setup lang="ts">
import CustomFeature from './CustomFeature.vue';
import { useData } from 'vitepress'
const { frontmatter } = useData()

const titles = [
    'Question Editor',
    'Database',
    'Worksheet Builder',
    'Document Viewer',
    'Account',

    'Front-end',
    'Server',
    'Development',
    'Production'
]
const descs = [
    'Contribute questions or edit existing ones!',
    'Browse the questions in our database.',
    'Build a customisable LaTeX worksheet.',
    'View and save your worksheet, or debug any errors!',
    'Configure your account.',

    "Website documentation, features and challenges",
    "Back-end server setup, features and challenges",
    "Development environment setup and use",
    "Deployment to cloud and AWS service setup"
]
const hrefs = [
    '',
    '',
    '',
    '',
    '',

    "/Frontend/setup-tutorial",
    "/Server/setup-and-basics-tutorial",
    "/Development/running-and-troubleshooting",
    "/Production/aws-iam"
]
</script>

<template>
    <div class="VPHome">
        <div class="viewport">
            <div class="docs-title">
                Latex Builder Documentation
            </div>
            <div class="docs-description">
                Welcome to the Latex Builder documentation hub. Here you can find information about the site's full suite of features, learn how to use its functions, and configure it to your liking.
            </div>
            <div class="docs-feature-container">
                <CustomFeature :title="titles[0]" :desc="descs[0]" :href="hrefs[0]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-lg">
                    <path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z">
                    </path></svg>
                </CustomFeature>
                <CustomFeature :title="titles[1]" :desc="descs[1]" :href="hrefs[1]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-lg">
                    <path d="M18.68,12.32C16.92,10.56 14.07,10.57 12.32,12.33C10.56,14.09 10.56,16.94 12.32,18.69C13.81,20.17 16.11,20.43 17.89,19.32L21,22.39L22.39,21L19.3,17.89C20.43,16.12 20.17,13.8 18.68,12.32M17.27,17.27C16.29,18.25 14.71,18.24 13.73,17.27C12.76,16.29 12.76,14.71 13.74,13.73C14.71,12.76 16.29,12.76 17.27,13.73C18.24,14.71 18.24,16.29 17.27,17.27M10.9,20.1C10.25,19.44 9.74,18.65 9.42,17.78C6.27,17.25 4,15.76 4,14V17C4,19.21 7.58,21 12,21V21C11.6,20.74 11.23,20.44 10.9,20.1M4,9V12C4,13.68 6.07,15.12 9,15.7C9,15.63 9,15.57 9,15.5C9,14.57 9.2,13.65 9.58,12.81C6.34,12.3 4,10.79 4,9M12,3C7.58,3 4,4.79 4,7C4,9 7,10.68 10.85,11H10.9C12.1,9.74 13.76,9 15.5,9C16.41,9 17.31,9.19 18.14,9.56C19.17,9.09 19.87,8.12 20,7C20,4.79 16.42,3 12,3Z" />
                    </svg>
                </CustomFeature>
                <CustomFeature :title="titles[2]" :desc="descs[2]" :href="hrefs[2]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-lg">
                    <path d="M3 6V8H14V6H3M3 10V12H14V10H3M20 10.1C19.9 10.1 19.7 10.2 19.6 10.3L18.6 11.3L20.7 13.4L21.7 12.4C21.9 12.2 21.9 11.8 21.7 11.6L20.4 10.3C20.3 10.2 20.2 10.1 20 10.1M18.1 11.9L12 17.9V20H14.1L20.2 13.9L18.1 11.9M3 14V16H10V14H3Z" />
                    </svg>
                </CustomFeature>
                <CustomFeature :title="titles[3]" :desc="descs[3]" :href="hrefs[3]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-lg">
                    <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
                    </svg>
                </CustomFeature>
                <CustomFeature :title="titles[4]" :desc="descs[4]" :href="hrefs[4]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-lg">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
                </CustomFeature>
            </div>
        </div>
        <div class="viewport">
            <div class="docs-title">
                Developer Documentation
            </div>
            <div class="docs-description">
                Read about how the website was built!
            </div>
            <div class="docs-feature-container">
                <CustomFeature :title="titles[5]" :desc="descs[5]" :href="hrefs[5]"></CustomFeature>
                <CustomFeature :title="titles[6]" :desc="descs[6]" :href="hrefs[6]"></CustomFeature>
                <CustomFeature :title="titles[7]" :desc="descs[7]" :href="hrefs[7]"></CustomFeature>
                <CustomFeature :title="titles[8]" :desc="descs[8]" :href="hrefs[8]"></CustomFeature>
            </div>
        </div>
    </div>
</template>

<style>
.viewport {
    margin: 20px 30px;
    border: 0;
    /* background-color: var(--background-light); */
    min-height: 300px;
    padding: 40px 60px;

    display: flex;
    flex-direction: column;
    gap: 20px;
}

.docs-title {
    font-size: var(--font-size-title1);
    font-weight: bold;
}

.docs-description {
    font-size: var(--font-size-lg1);
}
.docs-feature-container {
    display: grid;
    grid-template: auto / 49% 49%;
    gap: 10px;
    min-height: 100px;
    width: 100%;
    padding: 20px 0px;
}

@media (min-width: 800px) {
    .docs-feature-container {
        grid-template: auto / 33% 33% 33%;
        padding: 30px 0px;
    }
}

</style>