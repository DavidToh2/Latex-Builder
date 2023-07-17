<script setup lang="ts">

</script>
<template>
    <div class="viewport">
        LatexView
        <div class="latex">
            <textarea class="latex-text" name="documentClass" placeholder="documentClass:"></textarea>
            <textarea class="latex-text" name="packages" placeholder="Packages:"></textarea>
            <textarea class="latex-text" name="setup" placeholder="Setup:"></textarea>
            <textarea class="latex-text" name="title" placeholder="Title:"></textarea>
            <textarea class="latex-text" name="beginDocument" placeholder="Begin document:"></textarea>
            <textarea class="latex-text" name="body" placeholder="Type LaTeX here:"></textarea>
            <textarea class="latex-text" name="endDocument" placeholder="End document:"></textarea>
        </div>
    </div>
</template>
<style scoped>

.latex {
	border: 1px solid black;
	padding: 7px;
	border-radius: 6px;
}

.latex-text {
	width: 100%;
	height: fit-content;
	border: 0;
	padding: 0px;
	resize: none;
}
</style>