<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
onShow(() => {
    let token= uni.getStorageSync('token') 
    if (!token) uni.navigateTo({ url: "/pages/Login" })
}) 
</script>

<style></style>