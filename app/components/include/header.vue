<template>
    <Image src="~/assets/ResourcePage/Header2.png" class="rootHeader root"  stretch="aspectFill"  @tap="accueil" width="100%" height="500px"  />
</template>

<script>

	import accueil from "../accueil";
	
    export default {
		
        methods: { 
            accueil: function() {
				this.$navigateTo(accueil);
			}
        }
			
    };

</script>

<style>
.rootHeader{
	margin-top : -30px;
}
</style>