<template>
    <!-- Bottom navigation -->
	<StackLayout dock="bottom" :class="getClassMenu" ref="logoContainer" >
		
		<GridLayout  rows="auto,auto" columns="*,*,*" class="footerBandeau">
			<Label row="0" col="0" class="center" text="Equipe" @tap="navProfil"></Label>
			<Image row="1" col="0" src.decode="font://&#xf0c0;" :class="updateEquipe" @tap="navProfil"></Image>
			
			<Label row="0" col="1" class="center" text="Défis" @tap="navChallenges"></Label>
            <Image row="1" col="1" src.decode="font://&#xf164;" class="fa t-72" @tap="navChallenges"></Image>

			<Label row="0" col="2" class="center" text="Résultats" @tap="navResultats"></Label>
			<Image row="1" col="2" src.decode="font://&#xf201;" class="fa t-72" @tap="navResultats"></Image>
			
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
			},
			updateEquipe() {
				if (this.$store.state.updateEquipe) {
					return "fa t-72 red";
				}
				return "fa t-72";
			}
		},
        mounted() {
			this.menuOn = false;
			var orientationModule = require("@irman/nativescript-screen-orientation");
        	orientationModule.setCurrentOrientation("portrait");
		},
		methods: {
			loadMenu(){
				//console.log("changement de menuOn");
				this.menuOn = !this.menuOn;
			},
			navProfil() {
				this.$navigateTo(profil);
				this.menuOn = false;
			
			},
			navChallenges() {
				if (this.$store.state.selectedEquipe) {
					this.$navigateTo(mesDefis);
					this.menuOn = false;
				}
				else {
					alert({
						  title: "Selection d'une équipe",
						  message: "Veuillez sélectionner une équipe avant d'afficher les défis",
						  okButtonText: "OK"
						})
				}
			},
			navResultats() {
				if (this.$store.state.selectedEquipe) {
					this.$navigateTo(resultats);
					this.menuOn = false;
				}
				else {
					alert({
						  title: "Selection d'une équipe",
						  message: "Veuillez sélectionner une équipe avant d'afficher les résultats",
						  okButtonText: "OK"
						})
				}
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

	.red {
		color : red;
	}
	
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

	.menuIcon {
		z-index: 2;
		width : 10%;
		margin-left: 15%;
	}
	.menuText{
  
	  /* font */
	  background-color:#fbc62d;
	  color: white;
	  font-weight: bold;
	  font-style: normal;
	  font-stretch: normal;
	  font-size: 20px;
	  horizontal-alignment : left;
	  vertical-alignment : center;
	  margin-right : 20px;
	  border-radius: 30%;
	  border-width: 2.5%;
	  width : 60%;
	  height: 14%;
	  padding-top: 12.5%;
	  padding-left: 75%;
	  border-color: #fbc62d;
	  z-index: 2;
	}
	.menuBorder{
  
	  /* font */
	  background-color:white;
	  color: #fbc62d;
	  font-weight: bold;
	  font-style: normal;
	  font-stretch: normal;
	  font-size: 20px;
	  horizontal-alignment : center;
	  margin-right :  10px;
	  border-radius: 30%;
	  border-width: 2.5%;
	  width : 85%;
	  height: 14%;
	  z-index: 1;
	  border-color: #fbc62d;

	}
	
</style>