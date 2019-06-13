<template>
    <Image src="~/assets/telethon.jpg" @tap="home" width="195" marginTop="20"  />
</template>

<script>

	import home from "../Home";
	
    export default {
		
        methods: { 
            home: function() {
				this.$navigateTo(home);
			}
        }
			
    };

</script>

<style>
</style>