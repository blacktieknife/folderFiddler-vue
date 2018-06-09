<template>
    <div class="center_content" :style="{height:windowHeight}">
        <div class="center_item has-text-centered">
            <img src="http://thecatapi.com/api/images/get?format=src&type=gif" width="160px"><br>
            <h1 class="is-size-6" style="font-family:Trebuchet MS,Arial Black;font-weight:bolder;text-transform:uppercase;color:rgba(96,96,96, 0.8)">choose a directory to get started</h1>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    props:['windowHeight']
    
}
</script>

<style>

</style>
