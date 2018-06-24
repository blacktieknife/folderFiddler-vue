<template>
    <div :class="['modal', {'is-active':isError}]">
        <div class="modal-background is-warning"></div>
        <div class="modal-content">
            <div class="notification is-warning">
  <button class="delete"></button>
  {{isError}}
</div>
        </div>
        <button class="modal-close" aria-label="close"></button>
    </div>
</template>

<script>
import {ipcRenderer} from "electron";
export default {
    data(){
        return {
            isError:false
        }
    },
}
</script>

<style>

</style>
