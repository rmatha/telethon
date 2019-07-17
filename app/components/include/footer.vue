<template>
    <!-- Bottom navigation -->
	<StackLayout dock="bottom" :class="getClassMenu" ref="logoContainer" >
		<Image v-if="menuOn" src="~/assets/ResourcePage/footerDown.png" class="rootFooter root"  stretch="aspectFill" width="100%" height="200px"  @tap="loadMenu"/>
		<Image v-else src="~/assets/ResourcePage/footerUp.png" class="rootFooter root"  stretch="aspectFill" width="100%" height="200px"  @tap="loadMenu"/>
		<GridLayout  rows="100,100,100,*" columns="*,*" horizontalAlignment="center" class="innerFooter">
			<!--<Image src="~/assets/icons/equipe.jpg" @tap="navProfil" row="0" col="0" />
			<Image src="~/assets/icons/challenges.png" @tap="navChallenges" row="0" col="1" />
			<Image src="~/assets/icons/Star-Red.png" @tap="navResultats" row="0" col="2" />-->
			<Image  class="IconTeam" src="~/assets/icons/equipe_y.png" col="0" row="0"  />
			<Label class="boutonDev" text="Equipe"  row="0" col="1" @tap="navProfil"  />
			<Image  class="IconDefis" src="~/assets/icons/challenges_y.png" row="1" col="0"/>
			<Label class="boutonDev" text="Défis" row="1" col="1" @tap="navChallenges"/>
			<Image class="IconScore" src="~/assets/icons/resultat_y.png" row="2" col="0" />
			<Label class="boutonDev" text="Score" row="2" col="1" @tap="navResultats"/>
			
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
        mounted() {
			this.menuOn = false;
			var orientationModule = require("@irman/nativescript-screen-orientation");
        	orientationModule.setCurrentOrientation("portrait");
		},
		methods: {
			loadMenu(){
				console.log("changement de menuOn");
				this.menuOn = !this.menuOn;
			},
			navProfil() {
				this.$navigateTo(profil);
				this.menuOn = false;
			},
			navChallenges() {
				this.$navigateTo(mesDefis);
				this.menuOn = false;
			},
			navResultats() {
				this.$navigateTo(resultats);
				this.menuOn = false;
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
	.innerFooter {
		background-color : #fff;
		width : 100%;
	}
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
	.boutonDev{
  
	  /* font */
	  color: #fbc62d;
	  font-weight: bold;
	  font-style: normal;
	  font-stretch: normal;
	  font-size: 20px;
	  horizontal-alignment : left;
	  vertical-alignment : center;
	  margin-left : 20px;
	}
	
</style>