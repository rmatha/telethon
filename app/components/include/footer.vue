<template>
    <!-- Bottom navigation -->
	<GridLayout rows="50" columns="*, *, *" >
		<Image src="~/assets/icons/equipe.jpg" @tap="navProfil" row="0" col="0" />
		<Image src="~/assets/icons/challenges.png" @tap="navChallenges" row="0" col="1" />
		<Image src="~/assets/icons/Star-Red.png" @tap="navResultats" row="0" col="2" />
	</GridLayout>
</template>

<script>
    import profil from "../equipe/equipe";
    import mesDefis from "../defi/mesDefis";
    import resultats from "../resultats";
	
	
    export default {
        data() {
            return {
                
            };
        },
        computed: {
            navigationButtonClasses() {
                return component => ({
                    fa: true,
                    "nav-btn": true,
                });
            }
        },
        
		methods: {
			navProfil() {
				this.$navigateTo(profil);
			},
			navChallenges() {
				this.$navigateTo(mesDefis);
			},
			navResultats() {
				this.$navigateTo(resultats);
			},
		},
		components: {
            profil,
			mesDefis,
			resultats,
		}
    };
</script>


<style>
</style>