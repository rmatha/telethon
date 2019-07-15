<template>
    <Image src="~/assets/ResourcePage/Header2.png" class="rootHeader root"  stretch="aspectFill"  @tap="home" width="100%" height="500px"  />
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
.rootHeader{
	margin-top : -30px;
}
</style>