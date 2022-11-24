<script setup lang="ts">
</script>

<template>
    <div id="question-filters-container">
        <div id="question-filters">
            
        </div>
        <input type="text" id="question-search" name="question-search" placeholder="Search question text">
        
    </div>
</template>

<style scoped>

#question-filters-container {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0px;
    align-items: center;
}

#question-filters {
    height: 100px;
    border: 1px solid #000000;
    display: grid;
}

#question-search {
    width: 36%;
    height: 36px;
    border: 2px solid #000000;
    padding: 4px;
    border-radius: 8px;
    font-size: 24px;
}

#question-search::placeholder {
    text-align: center;
}

</style>