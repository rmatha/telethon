<template>
	<AbsoluteLayout>
		<Image left="0" top="0" src="~/assets/ResourcePage/Header2.png" class="rootHeader root"  stretch="aspectFill"  @tap="accueil" width="100%" height="500px"  />
		<Image left="0" top="0" src="~/assets/icons/back.png"   @tap="goBack"  height="100px" />
	</AbsoluteLayout>
</template>

<script>

	import accueil from "../accueil";
	
    export default {
		
        methods: { 
            accueil: function() {
				this.$navigateTo(accueil);
			},
			goBack: function() {
				this.$navigateBack();
			}
        }
			
    };

</script>

<style>
.rootHeader{
	margin-top : -30px;
}
</style>