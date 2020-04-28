<template>
    <!-- Bottom navigation -->
	<StackLayout dock="bottom" class="menu" >
		
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
			
			tapFlash(currentElement) {
				if (currentElement.className) {
					currentElement.className = currentElement.className + " flash";
				}
				else {
					currentElement.className = "flash";
				}
			},
			navProfil(args) {
				this.tapFlash(args.object);
				this.$navigateTo(profil);
			
			},
			navChallenges(args) {
				this.tapFlash(args.object);
				if (this.$store.state.selectedEquipe) {
					this.$navigateTo(mesDefis);
				}
				else {
					alert({
						  title: "Selection d'une équipe",
						  message: "Veuillez sélectionner une équipe avant d'afficher les défis",
						  okButtonText: "OK"
						})
				}
			},
			navResultats(args) {
				this.tapFlash(args.object);
				if (this.$store.state.selectedEquipe) {
					this.$navigateTo(resultats);
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
	
	.sideDrawerTitre {
		font-size : 40px;
		padding : 0 0 20 0;
		text-align : center;
	}
	.upLine {
		border-width: 2 0 0 0;
		border-color: white;
		border-radius : 0;
		padding : 10 0 0 0;
		width : 100%;
		text-align : left;
	}
	.textFermer {
		text-align : center;
		padding : 100px 0 0 0;
	}
	.flash {
		animation-name: flashAnim;
		animation-duration: 1;
	}
	@keyframes flashAnim {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	.red {
		color : red;
	}
	
	.innerFooter {
		background-color : #fff;
		width : 100%;
	}
	.menu {
		height : 160px;
	}


	
</style>