<template>
    <!-- Bottom navigation -->
	<StackLayout dock="bottom" :class="getClassMenu" ref="logoContainer" backgroundColor="#325487">
		<Label text="Mon menuu" class="labelMenu" @tap="loadMenu"/>
		<GridLayout  rows="50" columns="*, *, *" >
			<Image src="~/assets/icons/equipe.jpg" @tap="navProfil" row="0" col="0" />
			<Image src="~/assets/icons/challenges.png" @tap="navChallenges" row="0" col="1" />
			<Image src="~/assets/icons/Star-Red.png" @tap="navResultats" row="0" col="2" />
		</GridLayout>
	</StackLayout>
</template>

<script>
    import profil from "../equipe/equipe";
    import mesDefis from "../defi/mesDefis";
    import resultats from "../score/resultats";
	
	
    export default {
        data() {
            return {
                menuOn : false,
            };
        },
        computed: {
			getClassMenu() {
				if (this.menuOn) {
					return "menu menuTop";
				}
				return "menu" ;
			}
        },
        
		methods: {
			loadMenu(){
				console.log("changement de menuOn");
				this.menuOn = !this.menuOn;
			},
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
	.menu {
		height : 200px;
	}
	
	.menuTop {
		height: 100%;
	}
	.labelMenu {
		color : black;
		height : 200px;
	}

</style>