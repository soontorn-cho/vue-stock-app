<script setup lang="ts">
    import Nav from '@/components/frontend/Nav.vue'
    import Foot from '@/components/frontend/Foot.vue'
</script>

<template>
    <div>
        <Nav />
        <main>
            <router-view />
        </main>
        <Foot />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>